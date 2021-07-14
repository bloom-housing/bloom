import { HttpStatus } from "@nestjs/common"

export const USER_ERRORS = {
  ACCOUNT_CONFIRMED: { message: "accountConfirmed", status: HttpStatus.NOT_ACCEPTABLE },
  ERROR_SAVING: { message: "errorSaving", status: HttpStatus.BAD_REQUEST },
  NOT_FOUND: { message: "emailNotFound", status: HttpStatus.NOT_FOUND },
  TOKEN_EXPIRED: { message: "tokenExpired", status: HttpStatus.BAD_REQUEST },
  TOKEN_MISSING: { message: "tokenMissing", status: HttpStatus.BAD_REQUEST },
  EMAIL_IN_USE: { message: "emailInUse", status: HttpStatus.BAD_REQUEST },
}
