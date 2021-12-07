import { Strategy } from "passport-local"
import { PassportStrategy } from "@nestjs/passport"
import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common"
import { User } from "../entities/user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { PasswordService } from "../services/password.service"
import { UserService } from "../services/user.service"
import { USER_ERRORS } from "../user-errors"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService
  ) {
    super({
      usernameField: "email",
    })
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: ["leasingAgentInListings"],
    })

    if (user) {
      const validPassword = await this.passwordService.verifyUserPassword(user, password)
      if (UserService.isPasswordOutdated(user)) {
        throw new HttpException(
          USER_ERRORS.PASSWORD_OUTDATED.message,
          USER_ERRORS.PASSWORD_OUTDATED.status
        )
      }
      if (validPassword && user.confirmedAt) {
        return user
      }
    }
    throw new UnauthorizedException()
  }
}
