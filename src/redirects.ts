import qs, { ParsedQs } from "qs";
import { APPSTORE_HOST, GOOGLE_PLAY_STORE_HOST } from "./config";

import { Platform } from "./entities/fingerprint";

const URL_REWRITE: {
  [key: string]: string;
} = {
  "/google": "https://google.com",
  "/yandex": "https://yandex.ru/search/?text=lokimo",
};

export enum RouteType {
  Deeplink = "DEEPLINK",
  Rewrite = "REWRITE",
}

type RedirectRouterProps = {
  url: string;
  query: ParsedQs;
  platform: Platform;
};

export function createRedirectRoute({
  url,
  query,
  platform,
}: RedirectRouterProps): string {
  const rewriteTo = URL_REWRITE[url] || getTargetUrl({ platform });
  const [rewriteUrl, initQueryString] = rewriteTo.split("?");
  const initQuery = qs.parse(initQueryString);
  const queryString = qs.stringify({
    ...query,
    ...initQuery,
  });

  return `${rewriteUrl}${queryString ? `?${queryString}` : ""}`;
}

function getTargetUrl({ platform }: { platform: Platform }) {
  switch (platform) {
    case Platform.Android:
      return GOOGLE_PLAY_STORE_HOST;
    case Platform.IOs:
      return APPSTORE_HOST;
    default:
      // @todo: empty state page
      return "/404";
  }
}
