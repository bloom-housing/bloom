export class Logger {
  printLogs = true

  public log(message: string) {
    if (this.printLogs) {
      console.log(`[INFO] ${message}`)
    }
  }

  public error(err: Error | string) {
    if (err instanceof Error) {
      console.error(`[ERROR] ${err.stack}`)
    } else {
      console.error(`[ERROR] ${err}`)
    }
  }
}
