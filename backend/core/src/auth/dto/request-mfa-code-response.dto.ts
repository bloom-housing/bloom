import { Expose } from "class-transformer"

export class RequestMfaCodeResponseDto {
  @Expose()
  maskedPhoneNumber?: string

  @Expose()
  email?: string
}
