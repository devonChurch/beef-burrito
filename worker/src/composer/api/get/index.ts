// import * as Cookies from "es-cookie";
import { data as configData } from "../../../config";
import {
  createCookiePayloadFromRequest,
  ComposerApiSetBody,
} from "../../../composer";

type GetCookieOptions = {
  request: Request;
};

export const get = async ({ request }: GetCookieOptions) => {
  const baseKeys = Object.keys(configData);
  const cookies = request.headers.get("Cookie") ?? "";
  const payload = baseKeys
    .map((baseKey) => createCookiePayloadFromRequest(baseKey, cookies))
    .filter(Boolean);
  const { origin } = new URL(request.headers.get("referer") ?? request.url);

  return new Response(
    // Body: Pretty format (readability > minification for experimentation).
    JSON.stringify(payload, null, 2),

    // Options:
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": origin,
        // ...cookieHeaders
        // ...createCookieHeadersFromPayload({
        //   payload,
        //   origin: new URL(request.url).origin // request.headers.get("origin") || "",
        // })
        // "Content-Type": "text/plain",
        // "Access-Control-Allow-Credentials": "true",
        // "Access-Control-Allow-Origin": request.headers.get("origin") ?? "",
        // "Access-Control-Expose-Headers": "Set-Cookie",
        // "Set-Cookie": cookieEncoded,
      },
    }
  );
};
