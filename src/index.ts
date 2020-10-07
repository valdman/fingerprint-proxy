import util from "util";
import express from "express";
import cookieParser from "cookie-parser";
import fingerprint from "express-fingerprint";

import {renderWebapp} from './htmlTemplate';
import { PORT, FINGERPRINT_COOKIE_NAME, COOKIE_LIVETIME_IN_DAYS } from "./config";

const app = express();

app.use(fingerprint());
app.use(cookieParser());

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
    res.send(renderWebapp());
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})
