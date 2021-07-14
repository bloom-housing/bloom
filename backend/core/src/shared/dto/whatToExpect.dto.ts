import { Expose } from "class-transformer"
import { IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../types/validations-groups-enum"

export class WhatToExpect {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  applicantsWillBeContacted?: string | null
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  allInfoWillBeVerified?: string | null
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  bePreparedIfChosen?: string | null
}
