import express from "express";
import cookieParser from "cookie-parser";
import fingerprint from "express-fingerprint";
import { expressCspHeader, INLINE, NONCE, NONE, SELF } from 'express-csp-header';
import util from "util";

import {renderWebapp} from './htmlTemplate';
import { PORT, FINGERPRINT_COOKIE_NAME, COOKIE_LIVETIME_IN_DAYS } from "./config";

const app = express();

app.use(fingerprint());
app.use(cookieParser());
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
    const hour = 3600000;
    const day = 24 * hour;
    const updatedExpiresDate = new Date(Date.now() + (day * COOKIE_LIVETIME_IN_DAYS));
    res.cookie(FINGERPRINT_COOKIE_NAME, req.fingerprint.hash, { expires: updatedExpiresDate });
    req.next();
})

app.get('/', (req, res) => {
    res.send('')
})

app.get('/page', (req, res) => {
    // Nonce would be in the request while expressCspHeader is used
    const nonce = (req as any).nonce as string;
    res.send(renderWebapp({nonce}));
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})
