import { Strategy } from "passport-local"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { UserService } from "../services/user.service"
import { User } from "../entities/user.entity"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: "email",
    })
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email)
    if (user) {
      const validPassword = await this.userService.verifyUserPassword(user, password)
      if (validPassword && user.confirmedAt) {
        return user
      }
    }
    throw new UnauthorizedException()
  }
}
