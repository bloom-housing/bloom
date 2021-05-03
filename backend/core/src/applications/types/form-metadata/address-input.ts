import { FormMetadataExtraData } from "./form-metadata-extra-data"
import { Expose, Type } from "class-transformer"
import { IsDefined, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../../shared/types/validations-groups-enum"
import { AddressCreateDto } from "../../../shared/dto/address.dto"
import { ApiProperty } from "@nestjs/swagger"

export class AddressInput extends FormMetadataExtraData {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  @ApiProperty()
  value: AddressCreateDto
}
