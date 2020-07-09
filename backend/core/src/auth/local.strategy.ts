import { Strategy } from "passport-local"
import { PassportStrategy } from "@nestjs/passport"
import { User } from "../entity/user.entity"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { UserService } from "../user/user.service"

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
      if (validPassword) {
        return user
      }
    }
    throw new UnauthorizedException()
  }
}
