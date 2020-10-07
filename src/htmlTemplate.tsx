import React from 'react';
import crypto from 'crypto';
import { renderToString } from 'react-dom/server';

import {App} from './webapp/App';

type ServerRenderProps = {
  nonce: string;
};

export function renderWebapp({nonce}: ServerRenderProps) {
  const appRendered = renderToString(<App text='test'/>);
  const page = htmlTemplate({
    body: appRendered,
    title: 'Fingerprint proxy',
    nonce,
  });
  return page;
}

type Props = {
  body: string;
  title: string;
  nonce: string;
};

function htmlTemplate({ body, title, nonce }: Props){
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
        </head>
        
        <body>
          <div id="root">${body}</div>
        </body>
        <script nonce='${nonce}' src='index.js'></script>
      </html>
    `;
};
