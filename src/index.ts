import express from "express";
import { nanoid } from "nanoid";
import path from "path";
import cookieParser from "cookie-parser";
import fingerprint from "express-fingerprint";
import { expressCspHeader, INLINE, NONCE, NONE, SELF } from 'express-csp-header';

import {renderWebapp} from './htmlTemplate';
import { createRedirectRoute } from "./redirects";
import { PORT, FINGERPRINT_COOKIE_NAME, COOKIE_LIVETIME_IN_DAYS, REQUEST_ID_COOKIE_NAME, IS_DEVELOP_PAGE_HEADER_NAME } from "./config";
import { pingDb, saveFingerprnt } from "./db";
import { ClientFingerprintComponent, createFromRequest, ServerFingerprintComponent } from "./entities/fingerprint";

pingDb().then(() =>
    console.log('Connected to DB')
).catch(err => {
    console.log('Connect to DB failed', err);
});

const app = express();

app.use(fingerprint());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'webapp')));

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

    const serverFingerprintComponents = (req.fingerprint.components as unknown) as ServerFingerprintComponent;
    const platform = serverFingerprintComponents?.useragent?.os?.family;

    const isDevelopPage = url === '/develop';
    const redirectTo = createRedirectRoute({query, url, platform});

    res.send(renderWebapp({
        isDevelopPage,
        nonce,
        reqId,
        initComponents: req.fingerprint.components,
        redirectTo,
    }));
})

app.post('/fingerprint', async function next(req, res) {
    const clientComponents = req.body as ClientFingerprintComponent;
    const serverComponents = (req.fingerprint.components as unknown) as ServerFingerprintComponent;
    const reqId = req.header(REQUEST_ID_COOKIE_NAME);
    const hash = req.fingerprint.hash;

    const fingerprint = createFromRequest({clientComponents, serverComponents, reqId, hash});

    const saveResult = await saveFingerprnt(fingerprint);
    console.log('Saved fingerprint: ', saveResult.insertedId);

    res.send('');
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})
