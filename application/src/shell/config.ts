const BUILD = process.env.BUILD;
const PUBLIC_PATH = process.env.PUBLIC_PATH;

export const log = () =>
  console.log(`
> shell:config:
  + build: ${BUILD}
  + public path: ${PUBLIC_PATH}
`);

export const dom = () => `
<ul class="shell__list">
    <li class="shell__item"><strong>Build:</strong> ${BUILD}</li>
    <li class="shell__item"><strong>Public Path:</strong> ${PUBLIC_PATH}</li>
</ul>
`;
