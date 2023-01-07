import { data as configData } from "./config";
import { handleAssetRequest } from "./application";
import { set as setCookie } from "./composer"
// import { setCookie, getCookie } from "./composer";

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;

  SHELL_BUCKET: R2Bucket;
  POTATO_BUCKET: R2Bucket;
  COMPOSER_BUCKET: R2Bucket;
}

// type HandleApplicationOptions = {
//   application: keyof typeof configData;
//   build: string;
//   r2Bucket: R2Bucket;
//   request: Request;
//   url: URL;
// };

// const handleApplication = async (options: HandleApplicationOptions) => {
//   const overrides = await getCookie({ request: options.request });
//   console.log(`> worker:${options.application}:overrides: `, JSON.stringify(overrides));
//   const targetHost =
//   configData[options.application].environment[overrides?.environment ?? "production"].host;
//   const shouldRedirect = options.url.host !== targetHost;

//   if (shouldRedirect) {
//     const redirectLocation =
//       `${
//         overrides?.environment === "production" ? "https" : "http"
//       }://${targetHost}` + options.url.pathname;
//     console.log(
//       `> worker:${options.application}:redirect: `,
//       `${options.url.host} -vs- ${targetHost}`
//     );
//     console.log(`> worker:${options.application}:location: `, redirectLocation);

//     return new Response("", {
//       status: 307,
//       headers: new Headers({
//         Location: redirectLocation,
//         // "Access-Control-Allow-Credentials": "true",
//         // "Access-Control-Allow-Origin": options.request.headers.get("origin") ?? "",
//         // "Access-Control-Expose-Headers": "Set-Cookie",
//         // "Set-Cookie": options.request.headers.get("Cookie") ?? "",
//       }),
//     });
//   }

//   return fetchAsset({
//     build: overrides?.build ?? options.build,
//     pathname: options.url.pathname,
//     r2Bucket: options.r2Bucket,
//   });
// };

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    console.log("> worker:request: ", JSON.stringify(request, null, 2));
    console.log("> worker:env: ", JSON.stringify(env, null, 2));
    console.log("> worker:ctx: ", JSON.stringify(ctx, null, 2));
    console.log("> worker:cookies: ", request.headers.get("Cookie"));

    const url = new URL(request.url);

    if (
      url.host.startsWith("config.") // Xxxxx
    ) {
      return new Response(
        // Pretty format (readability > minification for experimentation).
        JSON.stringify(configData, null, 2),
        {
          headers: {
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": request.headers.get("origin") ?? "",
          }
        }
      );
    }

    if (
      url.host.startsWith("composer.") && // Xxxxx
      url.pathname.startsWith("/api/set") && // Xxxxx
      request.method === "POST" // Xxxxx
    ) {
      return await setCookie({ request });
    }

    if (
      url.host.startsWith("composer.") // Xxxxxx
    ) {
      return handleAssetRequest({
        application: "composer",
        build: "main",
        r2Bucket: env.COMPOSER_BUCKET,
        request,
        url,
      });
    }

    if (
      url.host.startsWith("shell.") // Xxxxxx
    ) {
      return handleAssetRequest({
        application: "shell",
        build: "main",
        r2Bucket: env.SHELL_BUCKET,
        request,
        url,
      });
    }

    if (
      url.host.startsWith("potato.") // Xxxxxx
    ) {
      return handleAssetRequest({
        application: "potato",
        build: "main",
        r2Bucket: env.POTATO_BUCKET,
        request,
        url,
      });
    }

    return new Response(
      `
> worker:init:1.0.3
> worker:no-trigger-found
> worker:config:
  + url: ${request.url}
		`.trim(),
      {
        status: 404,
      }
    );
  },
};
