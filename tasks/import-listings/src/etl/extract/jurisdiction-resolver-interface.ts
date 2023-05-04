import { Jurisdiction } from "../../types"
import { BaseStageInterface } from "../base-stage-interface"

export interface JurisdictionResolverInterface extends BaseStageInterface {
  fetchJurisdictions(): Promise<Jurisdiction[]>
}
