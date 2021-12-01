import { Strategy } from "passport-local"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { User } from "../entities/user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { PasswordService } from "../services/password.service"
import { UserService } from "../services/user.service"

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
      if (validPassword && user.confirmedAt && !UserService.isPasswordOutdated(user)) {
        return user
      }
    }
    throw new UnauthorizedException()
  }
}
