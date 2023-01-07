import * as Cookies from "es-cookie";
import { ComposerEntry, ComposerApiSetBody } from "../../types";
import { createCookieHeadersFromPayload } from "../../helpers/createCookieHeadersFromPayload";

type SetCookieOptions = {
    request: Request;
};

export const set = async ({ request }: SetCookieOptions) => {
  // const { base, dependencies = [] } =
  //   ((await request?.json()) as ComposerApiSetBody) ?? {};

  // const createSanitizedEntry = ({
  //   application,
  //   environment,
  //   build,
  // }: ComposerEntry) => ({
  //   ...(application && { application }),
  //   ...(environment && { environment }),
  //   ...(build && { build }),
  // });

  // const cookieKey = base.application;

  // const cookieValue = [base, ...dependencies].map(createSanitizedEntry);

  // const cookieEncoded = Cookies.encode(cookieKey, JSON.stringify(cookieValue), {
  //   secure: true,
  //   expires: 7, // Days.
  //   path: "/",
  //   domain: "beef-burrito.devon.pizza",
  //   sameSite: "none",
  // });

  // console.log("> worker:api/set:key ", cookieKey);
  // console.log("> worker:api/set:value ", cookieValue);
  // console.log("> worker:api/set:encoded ", cookieEncoded);

  const payload = ((await request?.json()) as ComposerApiSetBody);

  /**
   * @todo ZOD validation!
   */

  const cookieHeaders = createCookieHeadersFromPayload({
    payload,
    origin: new URL(request.url).origin // request.headers.get("origin") || "",
  });

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
