import { LogLevel } from '@nestjs/common';

export interface ApiEnvironment {
  version: string;
  production: boolean;
  serverPort: number;
  logLevel: LogLevel;
  serverPrefix: string;

  // OpenAPI documentation
  apiTitle: string;
  apiDescription: string;
  apiDoc: string;
}

export const environmentConfig = (): ApiEnvironment => ({
  version: process.env.VERSION ?? process.env.npm_package_version ?? '',
  production: (process.env.PRODUCTION ?? 'true') === 'true',
  serverPort: Number(process.env.SERVER_PORT ?? 3000),
  logLevel: (process.env.LOG_LEVEL ?? 'debug') as LogLevel,
  serverPrefix: process.env.SERVER_PREFIX ?? '',

  // OpenAPI documentation
  apiTitle: process.env.API_TITLE ?? 'Documentation API Chat',
  apiDescription: process.env.API_DESCRIPTION ?? "La documentation de l'api Chat",
  apiDoc: process.env.API_DOCUMENTATION ?? '',
});

export type Leaves<T> = T extends object
  ? { [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never ? '' : `.${Leaves<T[K]>}`}` }[keyof T]
  : never;

export type LeafTypes<T, S extends string> = S extends `${infer T1}.${infer T2}`
  ? T1 extends keyof T
    ? LeafTypes<T[T1], T2>
    : never
  : S extends keyof T
    ? T[S]
    : never;
