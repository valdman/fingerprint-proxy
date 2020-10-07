import express from "express";
import { nanoid } from "nanoid";
import { ParsedQs } from "qs";
import cookieParser from "cookie-parser";
import fingerprint from "express-fingerprint";
import { expressCspHeader, INLINE, NONCE, NONE, SELF } from 'express-csp-header';
import util from "util";

import {renderWebapp} from './htmlTemplate';
import { createRedirectRoute } from "./redirects";
import { PORT, FINGERPRINT_COOKIE_NAME, COOKIE_LIVETIME_IN_DAYS, REQUEST_ID_COOKIE_NAME, IS_DEVELOP_PAGE_HEADER_NAME } from "./config";

const app = express();

app.use(fingerprint());
app.use(cookieParser());
app.use(express.json());
app.use(express.static("webapp"));

app.use(expressCspHeader({
    directives: {
        'default-src': [SELF],
        'script-src': [NONCE],
        'style-src': [SELF, INLINE],
        'img-src': [SELF, 'data:'],
        'worker-src': [NONE],
        'block-all-mixed-content': true
    }
}));

app.get('/404', function next(_, res) {
    res.send('Page not found. Visit our homepage');
});

app.get('*', function next(req, res) {
    const MINUTE = 60000;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const updatedExpiresDate = new Date(Date.now() + (DAY * COOKIE_LIVETIME_IN_DAYS));

    const reqId = req.cookies[REQUEST_ID_COOKIE_NAME] || nanoid();

    res.cookie(FINGERPRINT_COOKIE_NAME, req.fingerprint.hash, { expires: updatedExpiresDate });

    // Nonce would be in the request while expressCspHeader is used
    const nonce = (req as any).nonce as string;

    const [url] = req.originalUrl.split("?");
    const query = req.query;

    const serverFingerprintComponents = req.fingerprint.components;
    const platform = (serverFingerprintComponents as any)?.useragent?.os?.family

    const isDevelopPage = url === '/develop';

    if(isDevelopPage) {
        res.send(renderWebapp({
            isDevelopPage: true,
            nonce,
            reqId,
            initComponents: req.fingerprint.components,
        }))
        return;
    }

    res.send(renderWebapp({
        isDevelopPage: false,
        nonce,
        reqId,
        redirectTo: createRedirectRoute({query, url, platform}),
    }));
})

app.post('/fingerprint', function next(req, res) {
    const clientFingerprintComponents = req.body;
    const serverFingerprintComponents = req.fingerprint.components;
    const reqId = req.headers[REQUEST_ID_COOKIE_NAME];

    console.log(util.inspect({
        reqId,
        serverFingerprintComponents,
        clientFingerprintComponents,
    }, {showHidden: false, depth: null, colors: true, maxStringLength: 50}));

    res.send('');
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})
