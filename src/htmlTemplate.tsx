import React from "react";
import { renderToString } from "react-dom/server";

import { App, AppProps } from "./webapp/App";

type ServerRenderProps = {
  nonce: string;
} & AppProps;

export function renderWebapp({ nonce, ...props }: ServerRenderProps) {
  const appRendered = renderToString(<App {...props} />);
  const page = htmlTemplate({
    body: appRendered,
    title: "Fingerprint proxy",
    nonce,
    props,
  });
  return page;
}

type TemplateProps = {
  body: string;
  title: string;
  nonce: string;
  props: AppProps;
};

function htmlTemplate({ body, title, nonce, props }: TemplateProps) {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
        </head>
        
        <body>
          <div id="root">${body}</div>
        </body>
        <script nonce='${nonce}'>
          window.__APP_PROPS__ = JSON.parse('${JSON.stringify(props)}');
        </script>
        <script nonce='${nonce}' src='index.js'></script>
      </html>
    `;
}
