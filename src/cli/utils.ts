// tslint:disable:no-console

export const logger = (level: string, ...arg: string[]) =>
  console.log(`[${level.toUpperCase()}]`, ...arg);

export const timer = () => {
  const t0 = new Date().getTime();

  return {
    spent() {
      const t1 = new Date().getTime();
      
      return (t1 - t0) / 1000;
    },
  };
};
