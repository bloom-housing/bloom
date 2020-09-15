import { AssetCreateDto } from "./asset.create.dto"
import { IsUUID } from "class-validator"
import { Expose } from "class-transformer"

export class AssetUpdateDto extends AssetCreateDto {
  @Expose()
  @IsUUID()
  id: string
}
