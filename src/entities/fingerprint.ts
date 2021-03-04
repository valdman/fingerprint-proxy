import { nanoid } from "nanoid";

export enum Platform {
  IOs = "iOS",
  Android = "Android",
  Desktop = "DESKTOP",
}

export function createFromRequest({
  clientComponents,
  serverComponents,
  reqId,
  hash,
}: CreateFromRequestProps): Fingerprint {
  return {
    _id: nanoid(),
    reqId,
    hash,
    ...serverComponents,
    ...clientComponents,
  };
}

export type Fingerprint = ServerFingerprintComponent &
  ClientFingerprintComponent & {
    _id: string;
    reqId: string;
    hash: string;
  };

export interface ServerFingerprintComponent {
  useragent: Useragent;
  acceptHeaders: AcceptHeaders;
  geoip: Geoip;
}

export interface ClientFingerprintComponent {
  userAgent: string;
  webdriver: string;
  language: string;
  colorDepth: number;
  deviceMemory: number;
  hardwareConcurrency: number;
  screenResolution: number[];
  availableScreenResolution: number[];
  timezoneOffset: number;
  timezone: string;
  sessionStorage: boolean;
  localStorage: boolean;
  indexedDb: boolean;
  addBehavior: boolean;
  openDatabase: boolean;
  cpuClass: string;
  platform: string;
  plugins: any[];
  canvas: string[];
  webgl: string[];
  webglVendorAndRenderer: string;
  hasLiedLanguages: boolean;
  hasLiedResolution: boolean;
  hasLiedOs: boolean;
  hasLiedBrowser: boolean;
  touchSupport: any[];
  fonts: string[];
  audio: string;
}

interface Browser {
  family: string;
  version: string;
}

interface Device {
  family: string;
  version: string;
}

interface Os {
  family: Platform;
  major: string;
  minor: string;
}

interface Useragent {
  browser: Browser;
  device: Device;
  os: Os;
}

interface AcceptHeaders {
  accept: string;
  language: string;
}

interface Geoip {
  country?: string;
}

type CreateFromRequestProps = {
  reqId: string;
  hash: string;
  clientComponents: ClientFingerprintComponent;
  serverComponents: ServerFingerprintComponent;
};
