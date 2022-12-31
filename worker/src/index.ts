import { config } from "./config";

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
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		console.log("> init:orchestration:request ", request);
		console.log("> init:orchestration:env ", env);
		console.log("> init:orchestration:ctx ", ctx);

		const url = new URL(request.url);
		
		if (url.host.startsWith("config.")) {
			return new Response(
				// Pretty format
				JSON.stringify(config, null, 2)
			);
		}
		
		return new Response(`
> worker:init:1.0.2

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
