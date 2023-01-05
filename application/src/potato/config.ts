const BUILD = process.env.BUILD;
const PUBLIC_PATH = process.env.PUBLIC_PATH;
const MODE = process.env.MODE;

export const log = () =>
  console.log(`
> potato:config:
  + build: ${BUILD}
  + public path: ${PUBLIC_PATH}
  + mode: ${MODE}
`);

export const dom = () => `
<ul class="potato__list">
    <li class="potato__item"><strong>Build:</strong> ${BUILD}</li>
    <li class="potato__item"><strong>Public Path:</strong> ${PUBLIC_PATH}</li>
    <li class="potato__item"><strong>Mode:</strong> ${MODE}</li>
</ul>
`;
