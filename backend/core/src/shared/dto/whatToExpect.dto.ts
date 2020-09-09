import { Expose } from "class-transformer"
import { IsString } from "class-validator"

export class WhatToExpect {
  @Expose()
  @IsString()
  applicantsWillBeContacted: string
  @Expose()
  @IsString()
  allInfoWillBeVerified: string
  @Expose()
  @IsString()
  bePreparedIfChosen: string
}
