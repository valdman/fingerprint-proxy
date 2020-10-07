import React from "react";

import { DevelopPage, DevelopPageProps } from "./DevelopPage";
import { RedirectPage, RedirectPageProps } from "./RedirectPage";

export type AppProps = DevelopPageProps | RedirectPageProps;

export function App(props: AppProps) {
  if(props.isDevelopPage) {
    return <DevelopPage {...props} />;
  }
  return <RedirectPage {...props} />;
}
