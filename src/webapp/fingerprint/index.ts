import fingerpirnt from "@fingerprintjs/fingerprintjs";

type FingerprntComponents = {
  [key: string]: any;
};

const FINGERPRINTING_DELAY = 500;

export function getBrowserFingerprint(): Promise<FingerprntComponents> {
  const requestIdleCallback = (window as any).requestIdleCallback || null;

  const toFingerprintComponents = (components: fingerpirnt.Component[]) => {
    return components.reduce(
      (acc, { key, value }) => ({
        ...acc,
        [key]: value,
      }),
      {} as FingerprntComponents
    );
  };
  return new Promise((resolve) => {
    const handler = () =>
      fingerpirnt.get((components) =>
        resolve(toFingerprintComponents(components))
      );

    if (requestIdleCallback) {
      requestIdleCallback(handler);
    } else {
      setTimeout(handler, FINGERPRINTING_DELAY);
    }
  });
}
