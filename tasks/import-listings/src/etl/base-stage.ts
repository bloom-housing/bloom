import { BaseStageInterface } from "./base-stage-interface"
import { Logger } from "./logger"

export abstract class BaseStage implements BaseStageInterface {
  protected logger: Logger = new Logger()

  // use methods over props to simplify mocking
  public setLogger(logger: Logger) {
    this.logger = logger
  }

  public getLogger(): Logger {
    return this.logger
  }

  // convenience function
  protected log(message: string) {
    this.logger.log(message)
  }
}
