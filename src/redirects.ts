import qs, { ParsedQs } from "qs";
import { APPSTORE_HOST, GOOGLE_PLAY_STORE_HOST } from "./config";

const URL_REWRITE: {
    [key: string]: string
} = {
    '/abc': 'https://google.com/'
};

export enum RouteType {
    Deeplink = 'DEEPLINK',
    Rewrite = 'REWRITE'
};

export enum Platform {
    IOs = 'iOS',
    Android = 'Android',
    Desktop = 'DESKTOP'
};

type RedirectRouterProps = {
    url: string,
    query: ParsedQs,
    platform: Platform,
};

export function createRedirectRoute({url, query, platform}: RedirectRouterProps): string {
    const rewriteTo = URL_REWRITE[url];
    const queryString = qs.stringify(query);
    if(rewriteTo) {
        return `${rewriteTo}${queryString ? `?${queryString}` : ''}`;
    }
    const targetUrl = getTargetUrl({platform});
    return `${targetUrl}${queryString ? `?${queryString}` : ''}`;
}

function getTargetUrl({platform}: {platform: Platform}) {
    switch(platform) {
        case Platform.Android:
            return GOOGLE_PLAY_STORE_HOST;
        case Platform.IOs:
            return APPSTORE_HOST;
        default:
            // @todo: empty state page
            return '/404';
    }
}
