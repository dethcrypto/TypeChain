import chalk from "chalk";
const { red, yellow } = chalk;

export class Logger {
  log(...args: any[]) {
    if (!(global as any).IS_CLI) {
      return;
    }

    // tslint:disable-next-line
    console.log(...args);
  }
  warn(...args: any[]) {
    if (!(global as any).IS_CLI) {
      return;
    }

    // tslint:disable-next-line
    console.warn(yellow(...args));
  }

  error(...args: any[]) {
    if (!(global as any).IS_CLI) {
      return;
    }

    // tslint:disable-next-line
    console.error(red(...args));
  }
}

export const logger = new Logger();
