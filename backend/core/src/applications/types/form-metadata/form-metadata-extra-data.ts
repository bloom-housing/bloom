import { Expose } from "class-transformer"
import { IsEnum, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../../shared/types/validations-groups-enum"
import { InputType } from "../../../shared/types/input-type"
import { ApiProperty } from "@nestjs/swagger"

export class FormMetadataExtraData {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(InputType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: InputType, enumName: "InputType" })
  type: InputType

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  key: string
}
