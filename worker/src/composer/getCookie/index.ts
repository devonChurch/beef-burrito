import * as Cookies from "es-cookie";
import { ComposerEntry, ComposerApiSetBody } from "../types";
import { config } from "../../config";

type SetCookieOptions = {
  request: Request;
};

type Dictionary = Record<string, keyof typeof config>;

export const getCookie = async ({ request }: SetCookieOptions) => {
  // STEP 1:
  // -------
  // get referrer
  // + turn into host
  // + find host in cofig
  // + extract application key

  // Build a list of host -vs- application
  // @example
  // {
  //     "shell.beef-burrito.devon.pizza": shell,
  //     "localhost:8000": shell,
  //     "potato.beef-burrito.devon.pizza": potato,
  //     "localhost:8001": potato,
  // }
  const dictionary: Dictionary = Object.entries(config).reduce(
    (acc, [key, value]) => ({
      ...acc,
      ...Object.values(value.environment).reduce(
        (acc, { host }) => ({
          ...acc,
          [host]: key,
        }),
        {}
      ),
    }),
    {}
  );

  console.log("> worker:composer:dictionary ", JSON.stringify(dictionary));

  const referer = request.headers.get("referer");
  const refererHost = referer && new URL(referer).host;
  const isValidReferer = refererHost && dictionary[refererHost];
  const requestHost = request.headers.get("host");

  // google.com
  const baseKey = isValidReferer ? refererHost : (requestHost as string);
  console.log("> worker:composer:baseKey ", baseKey);

  // STEP 2:
  // -------
  // find matching cookie
  // extract data from cookie
  // application + pathname + build

  const cookies = Cookies.parse(request.headers.get("Cookie") ?? "");
  console.log("> worker:composer:cookies ", cookies);

  const cookie = cookies?.[baseKey];
  console.log("> worker:composer:cookie ", cookie);

  // STEP 3:
  // -------
  // Pass overrides onto application fetch
};
