import * as Cookies from 'es-cookie';
import { config } from "./config";
import { fetchAsset } from "./application";

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

type ComposerEntry = {
	application: string,
	environment: "development" | "production",
	build: string,
};

type ComposerApiSetBody = {
	base: ComposerEntry,
	dependencies: ComposerEntry[],
};

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

    if (url.host.startsWith("config.")) {
      return new Response(
        // Pretty format (readability > minification for experimentation).
        JSON.stringify(config, null, 2)
      );
    }

    if (url.host.startsWith("composer.") && request.method === "POST" && url.pathname.startsWith("/api/set")) {

		const { base, dependencies } = await request?.json() as ComposerApiSetBody ?? {};

		/**
			{
				base: {
					application: "",
					environment: "",
					build: "",
				},
				dependencies: [
					{
						application: "",
						environment: "",
						build: "",
					},
					{
						application: "",
						environment: "",
						build: "",
					},
				]
			}
		*/

		const createSanitizedEntry = ({ application, environment, build }: ComposerEntry) => ({
			...application && { application },
			...environment && { environment },
			...build && { build },
		});

		const cookieKey = base.application;
		
		const cookieValue = dependencies.map(createSanitizedEntry);

		const cookieEncoded = Cookies.encode(
			cookieKey,
			JSON.stringify(dependencies.map(createSanitizedEntry)),
		{
			secure: true,
			expires: 7,
			path: "/",
			domain: "beef-burrito.devon.pizza",
			sameSite: "none"
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
		`;

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
			}
		}
      );
    }

    if (url.host.startsWith("shell.")) {
      return fetchAsset({ url, r2Bucket: env.SHELL_BUCKET });
    }

    if (url.host.startsWith("potato.")) {
      return fetchAsset({ url, r2Bucket: env.POTATO_BUCKET });
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
