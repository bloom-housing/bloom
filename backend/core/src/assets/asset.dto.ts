import { IsString, IsUUID } from "class-validator"
import { Asset } from "../entity/asset.entity"
import { Expose } from "class-transformer"

export class AssetDto implements Partial<Asset> {
  @Expose()
  @IsUUID()
  id: string

  @Expose()
  @IsString()
  referenceId: string

  @Expose()
  @IsString()
  referenceType: string

  @Expose()
  @IsString()
  label: string

  @Expose()
  @IsString()
  fileId: string
}
