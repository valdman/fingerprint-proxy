import { useEffect } from "react";
import { fetchSendFingerprint } from "./api/fetchSendFingerprint";
import { getBrowserFingerprint } from "./fingerprint";

export type RedirectPageProps = {
  redirectTo: string;
  reqId: string;
};

export function RedirectPage(props: RedirectPageProps): null {
  const { redirectTo, reqId } = props;

  useEffect(() => {
    getBrowserFingerprint().then((browserComponents) =>
      fetchSendFingerprint({ reqId, body: browserComponents }).finally(() =>
        window.open(redirectTo, "_self")
      )
    );
  }, []);

  return null;
}
