import { AssetDto } from "./asset.dto"
import { OmitType } from "@nestjs/swagger"

export class AssetCreateDto extends OmitType(AssetDto, ["id", "createdAt", "updatedAt"]) {}
