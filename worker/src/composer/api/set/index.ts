import * as Cookies from "es-cookie";
import { ComposerEntry, ComposerApiSetBody } from "../../types";
import { createCookieHeadersFromPayload } from "../../helpers/createCookieHeadersFromPayload";

type SetCookieOptions = {
    request: Request;
};

export const set = async ({ request }: SetCookieOptions) => {
  const payload = ((await request?.json()) as ComposerApiSetBody);

  /**
   * @todo ZOD validation!
   */

  const {origin} = new URL(request.headers.get("referer") ?? request.url);
  const cookieHeaders = createCookieHeadersFromPayload({ payload, origin });

  return new Response(
    // Body:
    "",

    // Options:
    {
      headers: {
        ...cookieHeaders
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
