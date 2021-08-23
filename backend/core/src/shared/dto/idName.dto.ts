import { IsString, IsUUID } from "class-validator"
import { Expose } from "class-transformer"
import { ValidationsGroupsEnum } from "../types/validations-groups-enum"

export class IdNameDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  name: string
}
