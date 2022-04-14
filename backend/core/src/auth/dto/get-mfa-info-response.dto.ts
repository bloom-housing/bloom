import { Expose } from "class-transformer"

export class GetMfaInfoResponseDto {
  @Expose()
  phoneNumber?: string

  @Expose()
  email?: string

  @Expose()
  isMfaEnabled: boolean

  @Expose()
  mfaUsedInThePast: boolean
}
