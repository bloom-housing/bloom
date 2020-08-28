import { PickType } from "@nestjs/swagger"
import { AssetDto } from "./asset.dto"

export class AssetCreateDto extends PickType(AssetDto, [
  "referenceId",
  "referenceType",
  "label",
  "fileId",
]) {}
