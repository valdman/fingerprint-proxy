import {ClientFingerprintComponent, FingerprintResult, ServerFingerprintComponent} from 'express-fingerprint';
import {nanoid} from 'nanoid';

interface I {
    query: Record<string, string>;
    url: string;
}

export enum Platform {
    IOs = 'iOS',
    Android = 'Android',
    Desktop = 'DESKTOP',
}

type CreateFromRequestProps = {
    reqId: string;
    hash: string;
    clientComponents: ClientFingerprintComponent;
    serverResult: FingerprintResult;
};

export interface FingerprintDto extends
    ClientFingerprintComponent  {
        _id: string;
        reqId: string;
        hash: string;
        server: ServerFingerprintComponent;
    };

export function createFromRequest({clientComponents, serverResult, reqId, hash}: CreateFromRequestProps): FingerprintDto {
    return {
        _id: nanoid(),
        reqId,
        hash,
        server: serverResult.components,
        ...clientComponents,
    };
}
