import { Listing } from "../../types"
import { BaseStageInterface } from "../base-stage-interface"

export interface TransformerInterface extends BaseStageInterface {
  mapAll(listings: Array<Listing>): Array<object>
}
