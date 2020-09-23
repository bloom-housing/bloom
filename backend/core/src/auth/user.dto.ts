import { OmitType } from "@nestjs/swagger"
import { User } from "../entity/user.entity"
import { Expose } from "class-transformer"

export class RegisterResponseDto extends OmitType(User, ["passwordHash", "applications"] as const) {
  @Expose()
  accessToken: string
}
