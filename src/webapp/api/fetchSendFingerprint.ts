import {REQUEST_ID_COOKIE_NAME} from '../../config';

type Body = {
    [key: string]: any;
};

type FetchSendFingerprintProps = {
    reqId: string;
    body: Body;
};

export function fetchSendFingerprint({reqId, body}: FetchSendFingerprintProps) {
    return fetch('/fingerprint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [REQUEST_ID_COOKIE_NAME]: reqId,
        },
        body: JSON.stringify(body),
        credentials: 'same-origin',
    });
}
