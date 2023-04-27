import { Jurisdiction, Listing } from "../../types"
import { BaseStageInterface } from "../base-stage-interface"

export interface ExtractorInterface extends BaseStageInterface {
  extract(jurisdictions: Jurisdiction[]): Promise<Array<Listing>>
}
