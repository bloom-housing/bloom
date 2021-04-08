import { IsString } from "class-validator"
import { Expose } from "class-transformer"
import { ValidationsGroupsEnum } from "../validations-groups.enum"

export class StatusDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  status: string
}
