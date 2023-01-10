import { Expose } from "class-transformer"

export class LoginResponseDto {
  @Expose()
  accessToken: string
}
