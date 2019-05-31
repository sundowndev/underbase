// tslint:disable:no-console

export const logger = (level: string, ...arg: string[]) =>
  console.log(`[${level.toUpperCase()}]`, ...arg);

export const timer = () => {
  const t0 = new Date().getTime();

  return {
    spent() {
      const t2 = new Date().getTime();
      const time = (t2 - t0) / 1000;

      return time;
    },
  };
};
