import { Logger } from "./logger"

export interface BaseStageInterface {
  setLogger(logger: Logger): void
  getLogger(): Logger
}
