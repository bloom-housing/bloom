import { Expose } from "class-transformer"
import { IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../types/validations-groups-enum"

export class WhatToExpect {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  applicantsWillBeContacted: string
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  allInfoWillBeVerified: string
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  bePreparedIfChosen: string
}
