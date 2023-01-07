type FetchAssetOptions = {
  build: string;
  pathname: string;
  r2Bucket: R2Bucket;
};

export const fetchAsset = async ({
  pathname,
  build,
  r2Bucket,
}: FetchAssetOptions) => {
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
    const sanitized = pathname.replace(/^\/|\/$/g, "");

    // Xxxxxx xxxx
    const hasFileExtension = /\..*$/.test(sanitized);

    return hasFileExtension
      ? `_builds/${build}/${sanitized}`
      : `_builds/${build}/index.html`;
  })();
  console.log("> worker:r2-key: ", key);

  const object = await r2Bucket.get(key);
  console.log("> worker:r2-object: ", object);

  if (!object) {
    return new Response("", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);

  return new Response(object.body, { headers });
};
