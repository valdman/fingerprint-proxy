import express from "express";
import { nanoid } from "nanoid";
import cookieParser from "cookie-parser";
import fingerprint from "express-fingerprint";
import { expressCspHeader, INLINE, NONCE, NONE, SELF } from 'express-csp-header';
import util from "util";

import {renderWebapp} from './htmlTemplate';
import { PORT, FINGERPRINT_COOKIE_NAME, COOKIE_LIVETIME_IN_DAYS, REQUEST_ID_COOKIE_NAME } from "./config";

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

app.get('*', function next(req, res) {
    console.log(util.inspect(req.fingerprint, {showHidden: false, depth: null}))

    const MINUTE = 60000;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const updatedExpiresDate = new Date(Date.now() + (DAY * COOKIE_LIVETIME_IN_DAYS));
    const requIdExpires = new Date(Date.now() + MINUTE)


    res.cookie(FINGERPRINT_COOKIE_NAME, req.fingerprint.hash, { expires: updatedExpiresDate });
    res.cookie(REQUEST_ID_COOKIE_NAME, req.cookies[REQUEST_ID_COOKIE_NAME] || nanoid(), { expires: requIdExpires });

    const reqId = req.cookies[REQUEST_ID_COOKIE_NAME];
    // Nonce would be in the request while expressCspHeader is used
    const nonce = (req as any).nonce as string;
    res.send(renderWebapp({
        nonce,
        reqId,
        initComponents: req.fingerprint.components,
    }));

    req.next();
})

app.post('/fingerprint', (req, res) => {
    const body = req.body;
    const reqId = req.headers[REQUEST_ID_COOKIE_NAME];
    res.send('');
});

app.get('/', (req, res) => {
    res.send('');
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})
