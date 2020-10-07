import React from 'react';
import { renderToString } from 'react-dom/server';

import {App} from './webapp/App';

export function renderWebapp() {
  const appRendered = renderToString(<App text='test'/>);
  const page = htmlTemplate({
    body: appRendered,
    title: 'Fingerprint proxy',
  });
  return page;
}

type Props = {
  body: string;
  title: string;
};

function htmlTemplate({ body, title }: Props){
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
        </head>
        
        <body>
          <div id="root">${body}</div>
        </body>
        <script src='index.js'></script>
      </html>
    `;
};
