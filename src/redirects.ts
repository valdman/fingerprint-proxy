import qs, {ParsedQs} from 'qs';

const URL_REWRITE: {
    [key: string]: string;
} = {
    '/google': 'https://google.com',
    '/yandex': 'https://yandex.ru/search/?text=lokimo',
};

type RedirectRouterProps = {
    url: string;
    query: ParsedQs;
};

export function createRedirectRoute({url, query}: RedirectRouterProps): string {
    const rewriteTo = URL_REWRITE[url];
    const [rewriteUrl, initQueryString] = rewriteTo.split('?');
    const initQuery = qs.parse(initQueryString);
    const queryString = qs.stringify({
        ...query,
        ...initQuery,
    });

    return `${rewriteUrl}${queryString ? `?${queryString}` : ''}`;
}
