import express from "express";
import cookieParser from "cookie-parser";
import fingerprint from "express-fingerprint";

import { PORT, FINGERPRINT_COOKIE_NAME, COOKIE_LIVETIME_IN_DAYS } from "./config";

const app = express();

app.use(fingerprint());
app.use(cookieParser());

app.get('*', function next(req, res) {
    console.log(req.fingerprint);
    const hour = 3600000;
    const day = 24 * hour;
    const updatedExpiresDate = new Date(Date.now() + (day * COOKIE_LIVETIME_IN_DAYS));
    res.cookie(FINGERPRINT_COOKIE_NAME, req.fingerprint.hash, { expires: updatedExpiresDate });
    req.next();
})

app.get('/', (req, res) => {
    res.send('')
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})
