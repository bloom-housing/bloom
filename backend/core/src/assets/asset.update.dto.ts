import { PickType } from "@nestjs/swagger"
import { AssetDto } from "./asset.dto"

export class AssetUpdateDto extends PickType(AssetDto, [
  "id",
  "referenceId",
  "referenceType",
  "label",
  "fileId",
]) {}
