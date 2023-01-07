import * as Cookies from "es-cookie";
import {
  data as configData,
  ConfigValue,
  ConfigEnvironmentValue,
} from "../../../config";
import { ComposerEntry, ComposerApiSetBody } from "../../types";

type HostKeyDict = Record<string, string>;

/**
 * Create a dictionary of "host" vs (application) "key" references.
 *
 * Matching the context of the Worker request "host" to an associated (application) "key" allows us
 * to extract any relevant cookie data and make custom compositions accurately.
 *
 * @example
 * {
 *   "shell.beef-burrito.devon.pizza":  "shell",
 *   "localhost:8000":                  "shell",
 *   "potato.beef-burrito.devon.pizza": "potato",
 *   "localhost:8001":                  "potato",
 * }
 */
const hostKeyDict: HostKeyDict = (() => {
  /**
   * Create the "host" references against a single (application) "key".
   *
   * @example
   * {
   *   "shell.beef-burrito.devon.pizza": "shell",
   *   "localhost:8000":                 "shell",
   * }
   *
   * @example
   * {
   *   "potato.beef-burrito.devon.pizza": "potato",
   *   "localhost:8001":                  "potato",
   * }
   */
  const reduceEnvironmentsIntoHosts =
    (key: string) => (acc: HostKeyDict, value: ConfigEnvironmentValue) => ({
      ...acc,
      [value.host]: key,
    });

  const reduceToplevelEntry = (
    acc: HostKeyDict,
    [key, value]: [string, ConfigValue]
  ) => ({
    ...acc,
    ...Object.values(value.environment).reduce(
      reduceEnvironmentsIntoHosts(key),
      {}
    ),
  });

  return Object.entries(configData).reduce(reduceToplevelEntry, {});
})();

export type Target = {
  base: string;
  app: string;
};

/**
 * Orientate ourselves against the Worker request to find the following host contexts.
 *
 * Base:
 * -----
 * The Micro Front-end "shell" host target.
 *
 * @example "shell.beef-burrito.devon.pizza"
 *
 * App:
 * ----
 * The Micro Front-end application host target.
 *
 * @note This target can be a supplementary MFE "application" or an asset from the MFE "shell".
 *
 * @example "shell.beef-burrito.devon.pizza"
 * @example "potato.beef-burrito.devon.pizza"
 */
 export const getBaseAndAppHostTargets = (request: Request): Target => {
  /**
   * The referer is not guaranteed to exist. In that regard, our fallback is to intentionally pick an
   * "href" that is outside of the scope of our MFE context (this will not exist in our dictionary
   * and force us to look elsewhere for a valid target).
   */
  const referer =
    request.headers.get("referer") ?? "https://does.not.exist.com";
  const refererHost = new URL(referer).host;
  const requestHost = new URL(request.url).host;

  return {
    /**
     * 99% of the time, the "referer" host will be correct. For initial "shell" .html requests from
     * another domain (i.e. google.com) the context will be invalid, so we instead reference the
     * "request" host (as a "shell" request is always the "base").
     */
    base: hostKeyDict[refererHost] ?? hostKeyDict[requestHost],
    app: hostKeyDict[requestHost],
  };
};

/**
 * Convert the stringified and encoded Cookie array into its original object payload structure.
 *
 * @example
 * Before:
 * -------
 * [{%22application%22:%22shell%22%2C%22environment%22:%22production%22%2C%22build%22:%22foo%22}%2C{%22application%22:%22potato%22%2C%22environment%22:%22development%22}]
 *
 * After:
 * ------
 * {
 *   base: {
 *     application: "shell"
 *     environment: "production"
 *     build: "foo"
 *   },
 *   dependencies: [
 *     application: "potato",
 *     environment: "development"
 *   ]
 * }
 */
const reconstructPayloadFromCookie = (
  target: Target,
  cookies: string | null
) => {
  const cookieDictionary = Cookies.parse(cookies || "");

  /**
   * @note We only want the composer entry that is associated with the current "base" target (whatever the Micro Front-end "shell" is set to). 
   * 
   * ALL OTHER COMPOSITION ENTRIES ARE IRRELEVANT FOR THIS REQUEST SCENARIO!
   */
  const cookieItem = cookieDictionary[target.base];

  /**
   * Not every request will have a composition associated with it (which is fine). We bail out and
   * return `undefined` in this scenario.
   */
  if (!cookieItem) return;

  const cookieData: ComposerEntry[] = JSON.parse(cookieItem);
  const [base, ...dependencies] = cookieData;

  return {
    base,
    /**
     * @note The "dependencies" key/value pair are NOT always present (e.g. we might only be composing
     * the "base" target), so we conditionally omit if required.
     */
    ...(dependencies && dependencies),
  };
};

/**
 * Recreate the original payload that created the current Cookie composition entry (if any).
 */
export const createCookiePayloadFromRequest = (
  // request: Request
  target: Target,
  cookies: string
): ComposerApiSetBody | undefined => {
  // const target = getBaseAndAppHostTargets(request);
  // const cookies = request.headers.get("Cookie");
  return reconstructPayloadFromCookie(target, cookies);
};
