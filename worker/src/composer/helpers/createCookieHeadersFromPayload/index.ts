import * as Cookies from "es-cookie";
import { ComposerEntry, ComposerApiSetBody } from "../../types";

/**
 * Xxxx xxxx.
 * Xxxx xxxx.
 */
const createSanitizedEntry = ({
  application,
  environment,
  build,
}: ComposerEntry) => ({
  application,
  environment,

  // Xxxxx xxxx xxxxx
  ...(build && { build }),
});

type CreateCookieHeadersFromPayloadOptions = {
  payload?: ComposerApiSetBody,
  origin: string;
  domain?: string;
  expires?: number;
}

/**
 * Xxxx xxxx.
 * Xxxx xxxx.
 */
export const createCookieHeadersFromPayload = (options: CreateCookieHeadersFromPayloadOptions) => {
  // Xxxxx xxxx.
  if (!options.payload) return;

  const {
    base,

    // Xxxx xxxx
    dependencies = []
  } = options.payload;

  // Xxxx
  const cookieKey = base.application;

  // Xxxx
  const cookieValue = [base, ...dependencies].map(createSanitizedEntry);

  const cookieEncoded = Cookies.encode(cookieKey, JSON.stringify(cookieValue), {
    secure: true,
    expires: options.expires ?? 7, // Days.
    path: "/",
    domain: options.domain ?? "beef-burrito.devon.pizza",
    sameSite: "none",
  });

  return {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Expose-Headers": "Set-Cookie",
    "Access-Control-Allow-Origin": options.origin,
    "Set-Cookie": cookieEncoded,
  }
};
