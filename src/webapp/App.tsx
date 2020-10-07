import React, { useEffect, useState } from "react";
import fingerpirnt from "@fingerprintjs/fingerprintjs";

import { fetchSendFingerprint } from "./api/fetchSendFingerprint";

type FingerprntComponents = {
  [key: string]: any;
};

export type AppProps = {
  reqId: string,
  initComponents?: FingerprntComponents,
};

const FINGERPRINTING_DELAY = 500;

export function App(props: AppProps) {
  const { initComponents, reqId } = props;
  const [components, setComponents] = useState<FingerprntComponents>(initComponents || {});

  useEffect(() => {
    getBrowserFingerprint().then((browserComponents: FingerprntComponents) => {
      setComponents({
        ...components,
        ...browserComponents,
      });
      return fetchSendFingerprint({reqId, body: components});
    });
  }, []);

  return (
    <>
      {Object.entries(components).map(([key, value]) => (
        <div key={key}>
          <h2>{key}</h2> {JSON.stringify(value)} <br/>
        </div>
      ))}
    </>
  );
}

function getBrowserFingerprint(): Promise<FingerprntComponents> {
  const requestIdleCallback = (window as any).requestIdleCallback || null;
  const toFingerprintComponents = (components: fingerpirnt.Component[]) => {
    return components.reduce((acc, {key, value}) => ({
        ...acc,
        [key]: value,
    }), {} as FingerprntComponents);
  }
  return new Promise((resolve) => {
    const handler = () => fingerpirnt.get(components => resolve(toFingerprintComponents(components)));
    if (requestIdleCallback) {
      requestIdleCallback(handler);
    } else {
      setTimeout(handler, FINGERPRINTING_DELAY);
    }
  });
}
