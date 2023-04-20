import { Expose } from "class-transformer"

export class LogoutResponseDto {
  @Expose()
  success: boolean
}
