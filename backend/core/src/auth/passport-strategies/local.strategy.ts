import { Strategy } from "passport-local"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { User } from "../entities/user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { PasswordService } from "../services/password.service"

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
      where: { email },
      relations: ["leasingAgentInListings"],
    })

    if (user) {
      const validPassword = await this.passwordService.verifyUserPassword(user, password)
      if (validPassword && user.confirmedAt) {
        return user
      }
    }
    throw new UnauthorizedException()
  }
}
