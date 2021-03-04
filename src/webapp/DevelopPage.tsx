import React, {useEffect, useState} from 'react';

import {getBrowserFingerprint} from './fingerprint';
import {fetchSendFingerprint} from './api/fetchSendFingerprint';
import {ServerFingerprintComponent} from 'express-fingerprint';

type FingerprntComponents = {
    [key: string]: any;
};

export type DevelopPageProps = {
    reqId: string;
    initComponents?: ServerFingerprintComponent;
};

export function DevelopPage(props: DevelopPageProps) {
    const {initComponents, reqId} = props;
    const [components, setComponents] = useState<FingerprntComponents>(initComponents || {});

    useEffect(() => {
        getBrowserFingerprint().then((browserComponents: FingerprntComponents) => {
            setComponents({
                ...components,
                ...browserComponents,
            });
            return fetchSendFingerprint({reqId, body: browserComponents});
        });
    }, []);

    return (
        <div style={{maxWidth: '100vw', overflowX: 'hidden'}}>
            {Object.entries(components).map(([key, value]) => (
                <div key={key}>
                    <h2>{key}</h2>
                    <span style={{whiteSpace: 'break-spaces'}}>{JSON.stringify(value)}</span>
                </div>
            ))}
        </div>
    );
}
