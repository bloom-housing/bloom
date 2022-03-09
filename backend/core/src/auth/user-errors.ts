import { HttpStatus } from "@nestjs/common"
import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"

export enum UserErrorMessages {
  accountConfirmed = "accountConfirmed",
  accountNotConfirmed = "accountNotConfirmed",
  errorSaving = "errorSaving",
  emailNotFound = "emailNotFound",
  tokenExpired = "tokenExpired",
  tokenMissing = "tokenMissing",
  emailInUse = "emailInUse",
  passwordOutdated = "passwordOutdated",
}

export const USER_ERRORS = {
  ACCOUNT_CONFIRMED: { message: UserErrorMessages.accountConfirmed, status: HttpStatus.NOT_ACCEPTABLE },
  ACCOUNT_NOT_CONFIRMED: { message: UserErrorMessages.accountNotConfirmed, status: HttpStatus.UNAUTHORIZED },
  ERROR_SAVING: { message: UserErrorMessages.errorSaving, status: HttpStatus.BAD_REQUEST },
  NOT_FOUND: { message: UserErrorMessages.emailNotFound, status: HttpStatus.NOT_FOUND },
  TOKEN_EXPIRED: { message: UserErrorMessages.tokenExpired, status: HttpStatus.BAD_REQUEST },
  TOKEN_MISSING: { message: UserErrorMessages.tokenMissing, status: HttpStatus.BAD_REQUEST },
  EMAIL_IN_USE: { message: UserErrorMessages.emailInUse, status: HttpStatus.BAD_REQUEST },
  PASSWORD_OUTDATED: { message: UserErrorMessages.passwordOutdated, status: HttpStatus.UNAUTHORIZED },
}

export class UserErrorExtraModel {
  @ApiProperty({enum: UserErrorMessages})
  @Expose()
  userErrorMessages: UserErrorMessages
}

