const BUILD = process.env.BUILD;
const PUBLIC_PATH = process.env.PUBLIC_PATH;
const MODE = process.env.MODE;

export const log = () =>
  console.log(`
> composer:config:
  + build: ${BUILD}
  + public path: ${PUBLIC_PATH}
  + mode: ${MODE}
`);

export const dom = () => `
<ul class="composer__list">
    <li class="composer__item"><strong>Build:</strong> ${BUILD}</li>
    <li class="composer__item"><strong>Public Path:</strong> ${PUBLIC_PATH}</li>
    <li class="composer__item"><strong>Mode:</strong> ${MODE}</li>
</ul>
`;
