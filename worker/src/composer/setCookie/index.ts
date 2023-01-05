import * as Cookies from "es-cookie";
import { ComposerEntry, ComposerApiSetBody } from "../types";

type SetCookieOptions = {
    request: Request;
};

export const setCookie = async ({ request }: SetCookieOptions) => {
  const { base, dependencies } =
    ((await request?.json()) as ComposerApiSetBody) ?? {};

  const createSanitizedEntry = ({
    application,
    environment,
    build,
  }: ComposerEntry) => ({
    ...(application && { application }),
    ...(environment && { environment }),
    ...(build && { build }),
  });

  const cookieKey = base.application;

  const cookieValue = [base, ...dependencies].map(createSanitizedEntry);

  const cookieEncoded = Cookies.encode(cookieKey, JSON.stringify(cookieValue), {
    secure: true,
    expires: 7, // Days.
    path: "/",
    domain: "beef-burrito.devon.pizza",
    sameSite: "none",
  });

  console.log("> worker:api/set:key ", cookieKey);
  console.log("> worker:api/set:value ", cookieValue);
  console.log("> worker:api/set:encoded ", cookieEncoded);

  const cookieBody = `

+ ---------------------- +
| Generated Composition: |
+ ---------------------- +


Cookie Key:
-----------
${cookieKey}


Cookie Value:
-------------
${JSON.stringify(cookieValue, null, 2)}


Cookie Encoded:
---------------
${cookieEncoded}
    `.trim();

  return new Response(
    // Body:
    cookieBody,

    // Options:
    {
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": request.headers.get("origin") ?? "",
        "Access-Control-Expose-Headers": "Set-Cookie",
        "Set-Cookie": cookieEncoded,
      },
    }
  );
};
