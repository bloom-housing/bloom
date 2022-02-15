import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ListingImage } from "../entities/listing-image.entity"
import { AssetUpdateDto } from "../../assets/dto/asset.dto"

export class ListingImageDto extends OmitType(ListingImage, ["listing", "image"] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetUpdateDto)
  image: AssetUpdateDto
}
