import { readFileSync } from "fs";
import { transformHtml } from "amp-toolbox-optimizer";
import { currentVersion } from "amp-toolbox-runtime-version";

const cachedStyles = {};
function stylesheet(name): string {
  if (cachedStyles[name]) return cachedStyles[name];
  cachedStyles[name] = readFileSync(`${__dirname}/../assets/${name}.css`, { encoding: "utf8" });
  return cachedStyles[name];
}

export function render({ title, body, styles = [] }: { title?: string; body: any; styles?: string[] }) {
  return `
  <!doctype html>
  <html ⚡>
  <head>
  <meta charset="utf-8">
  <!-- <link href="https://fonts.googleapis.com/css?family=Rubik:300,500|Material+Icons" rel="stylesheet"> -->
  <title>${title || "Escapable - Escape Room Directory"}</title>
  <link rel="canonical" href="./regular-html-version.html">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <style amp-custom>
  ${stylesheet("common")}
  ${styles.map(s => stylesheet(s)).join("\n")}
  </style>
  <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-accordion" src="https://cdn.ampproject.org/v0/amp-accordion-0.1.js"></script>
  <script async custom-element="amp-font" src="https://cdn.ampproject.org/v0/amp-font-0.1.js"></script>
  </head>
  <body>
    <amp-font layout="nodisplay" font-family="Material Icons" timeout="10000" on-load-add-class="hasicons"></amp-font>
    <amp-font layout="nodisplay" font-family="Rubik" timeout="0" on-error-add-class="norubik"></amp-font>
    <header>
      <a href="/"><amp-img src="/images/logo.svg" height="56" width="200" alt="Escapable"></amp-img></a>
    </header>
    <main>
      ${body}
    </main>
  </body>
  </html>
`;
}

export async function optimize(html: string, ampUrl: string): Promise<string> {
  return transformHtml(html, {
    ampUrl: ampUrl,
    ampRuntimeVersion: await currentVersion()
  });
}
