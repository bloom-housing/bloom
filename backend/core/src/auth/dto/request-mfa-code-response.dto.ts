import { Expose } from "class-transformer"

export class RequestMfaCodeResponseDto {
  @Expose()
  phoneNumber?: string

  @Expose()
  email?: string

  @Expose()
  phoneNumberVerified?: boolean
}
