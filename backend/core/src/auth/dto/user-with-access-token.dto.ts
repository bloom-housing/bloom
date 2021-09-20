import { Expose } from "class-transformer"
import { UserDto } from "./user.dto"

export class UserWithAccessTokenDto extends UserDto {
  @Expose()
  accessToken: string
}
