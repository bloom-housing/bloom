import { BaseStageInterface } from "../base-stage-interface"

export interface LoaderInterface extends BaseStageInterface {
  open(): void
  load(rows: object): void
  close(): void
}
