import { Asset } from "../entity/asset.entity"
import { OmitType } from "@nestjs/swagger"

export class AssetDto extends OmitType(Asset, ["listing"] as const) {}
