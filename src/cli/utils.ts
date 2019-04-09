// tslint:disable:no-console

export const logger = (level: string, ...arg: string[]) =>
  console.log(`[${level}]`, ...arg);
