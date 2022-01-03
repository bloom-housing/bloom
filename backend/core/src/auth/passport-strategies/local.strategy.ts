import { Strategy } from "passport-local"
import { PassportStrategy } from "@nestjs/passport"
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { InjectRepository } from "@nestjs/typeorm"
import { IsNull, Not, Repository } from "typeorm"
import { User } from "../entities/user.entity"
import { PasswordService } from "../services/password.service"
import { UserService } from "../services/user.service"
import { USER_ERRORS } from "../user-errors"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService
  ) {
    super({
      usernameField: "email",
    })
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase(), confirmedAt: Not(IsNull()) },
      relations: ["leasingAgentInListings"],
    })

    if (user) {
      const retryAfter = new Date(
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        user.lastLoginAt.getTime() + this.configService.get<number>("AUTH_LOCK_LOGIN_COOLDOWN_MS")
      )
      if (
        user.failedLoginAttemptsCount >=
          this.configService.get<number>("AUTH_LOCK_LOGIN_AFTER_FAILED_ATTEMPTS") &&
        retryAfter > new Date()
      ) {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            error: "Too Many Requests",
            message: "Failed login attempts exceeded.",
            retryAfter,
          },
          429
        )
      }

      user.lastLoginAt = new Date()

      const validPassword = await this.passwordService.isPasswordValid(user, password)
      if (UserService.isPasswordOutdated(user)) {
        throw new HttpException(
          USER_ERRORS.PASSWORD_OUTDATED.message,
          USER_ERRORS.PASSWORD_OUTDATED.status
        )
      }
      if (validPassword && user.confirmedAt) {
        user.failedLoginAttemptsCount = 0
      } else {
        user.failedLoginAttemptsCount += 1
      }
      await this.userRepository.save(user)

      if (validPassword) {
        return user
      }
    }
    throw new UnauthorizedException()
  }
}
