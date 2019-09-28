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
    console.warn(...args);
  }

  error(...args: any[]) {
    if (!(global as any).IS_CLI) {
      return;
    }

    // tslint:disable-next-line
    console.error(...args);
  }
}

export const logger = new Logger();
