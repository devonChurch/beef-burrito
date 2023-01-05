import { config } from "./config";
import { fetchAsset } from "./application";
import { setCookie, getCookie } from "./composer";

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
}

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

    // request.headers.referer
    // "referer": "http://localhost:8000/",

    if (
      url.host.startsWith("config.") // Xxxxx
    ) {
      return new Response(
        // Pretty format (readability > minification for experimentation).
        JSON.stringify(config, null, 2)
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
      url.host.startsWith("shell.") // Xxxxxx
    ) {
      const overrides = await getCookie({ request });
      console.log("> worker:shell:overrides: ", JSON.stringify(overrides));

      const targetHost = config.shell.environment[overrides?.environment ?? "production"].host;

      const shouldRedirect = url.host !== targetHost

      if (shouldRedirect) {
        const redirectLocation = `${overrides?.environment === "production" ? "https" : "http"}://${targetHost}` + url.pathname

        console.log("> worker:shell:redirect: ", `${url.host} -vs- ${targetHost}`);
        console.log("> worker:shell:location: ", redirectLocation);

        return new Response("", {
          status: 307,
          headers: new Headers({
            Location: redirectLocation,
          }),
        });
      }

      return fetchAsset({
        build: overrides?.build ?? "main",
        pathname: url.pathname,
        r2Bucket: env.SHELL_BUCKET,
      });
    }

    if (
      url.host.startsWith("potato.") // Xxxxxx
    ) {
      const overrides = await getCookie({ request });
      console.log("> worker:potato:overrides: ", JSON.stringify(overrides));

      const targetHost = config.potato.environment[overrides?.environment ?? "production"].host;

      const shouldRedirect = url.host !== targetHost

      if (shouldRedirect) {
        const redirectLocation = `${overrides?.environment === "production" ? "https" : "http"}://${targetHost}` + url.pathname

        console.log("> worker:potato:redirect: ", `${url.host} -vs- ${targetHost}`);
        console.log("> worker:potato:location: ", redirectLocation);

        return new Response("", {
          status: 307,
          headers: new Headers({
            Location: redirectLocation,
          }),
        });
      }

      return fetchAsset({
        build: overrides?.build ?? "main",
        pathname: url.pathname,
        r2Bucket: env.POTATO_BUCKET,
      });
    }

    return new Response(`
> worker:init:1.0.3

> worker:no-trigger-found

> worker:config:
  + url: ${request.url}
		`);

    // "url": "https://orchestration.devonchurch.workers.dev/",

    // return new Response("", {
    // 	status: 307,
    // 	headers: new Headers({
    // 		Location: "http://localhost:8080"
    // 	})
    // });
  },
};
