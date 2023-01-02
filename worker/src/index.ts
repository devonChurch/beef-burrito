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

  SHELL_BUCKET: R2Bucket;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    console.log("> worker:request: ", request);
    console.log("> worker:env: ", env);
    console.log("> worker:ctx: ", ctx);

    const url = new URL(request.url);

    if (url.host.startsWith("config.")) {
      return new Response(
        // Pretty format
        JSON.stringify(config, null, 2)
      );
    }

    if (url.host.startsWith("shell.")) {
      const key = (() => {
        // Remove prepending or appending slash(es).
        //
        // @example
        // + Before: "/foo/bar.js"
        // + After:  "foo/bar.js"
        //
        // @example
        // + Before: "/foo/bar/baz/"
        // + After:  "foo/bar/baz"
        const sanitized = url.pathname.replace(/^\/|\/$/g, "");

        // Xxxxxx xxxx
        const hasFileExtension = /\..*$/.test(sanitized);

        return hasFileExtension
          ? `_builds/main/${sanitized}`
          : "_builds/main/index.html";
      })();

	  console.log("> worker:r2-key: ", key);
	  
      const object = await env.SHELL_BUCKET.get(key);
	  
	  console.log("> worker:r2-object: ", object);

      if (object === null) {
        return new Response("Object Not Found", { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);

      return new Response(object.body, {
        headers,
      });
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
