import { data as configData, ConfigKeys } from "../../config";
import { fetchAsset } from "../fetchAsset";
import { extractOverridesFromCookie, createCookieHeadersFromPayload, getBaseAndAppHostTargets, createCookiePayloadFromRequest } from "../../composer";

type HandleAssetRequestOptions = {
  application: ConfigKeys;
  build: string;
  r2Bucket: R2Bucket;
  request: Request;
  url: URL;
};

/**
 * Xxxx xxxx.
 * Xxxx xxxx.
 */
export const handleAssetRequest = async (options: HandleAssetRequestOptions) => {

  // const overrides = await getCookie({ request: options.request });

  const target = getBaseAndAppHostTargets(options.request);
  const cookies = options.request.headers.get("Cookie") ?? "";
  const payload = createCookiePayloadFromRequest(target.base, cookies);
  const override = extractOverridesFromCookie(target, payload);
  console.log(`> worker:${options.application}:override: `, JSON.stringify(override));
  const targetHost = configData[options.application].environment[override?.environment ?? "production"].host;
  const shouldRedirect = options.url.host !== targetHost;

  const { origin, host } = new URL(options.request.url);
  // const domain = `.${host}`;
  

  if (shouldRedirect) {
    const redirectLocation =
      `${
        override?.environment === "production" ? "https" : "http"
      }://${targetHost}` + options.url.pathname;

    const domain = override?.environment === "production" ? undefined : `localhost`; // `.app.${targetHost}:`;
    
    console.log(
      `> worker:${options.application}:redirect: `,
      `  + ${options.url.host} -vs- ${targetHost}`,
      `  + domain: ${domain}`
    );
    console.log(`> worker:${options.application}:location: `, redirectLocation);

    const cookieHeaders = createCookieHeadersFromPayload({
      payload,
      origin,
      domain
    });

    return new Response("", {
      status: 307,
      headers: new Headers({
        Location: redirectLocation,
        ...cookieHeaders,
        // "Set-Cookie": "foo=bar"
      }),
    });
  }

  return fetchAsset({
    build: override?.build ?? options.build,
    pathname: options.url.pathname,
    r2Bucket: options.r2Bucket,
  });

};