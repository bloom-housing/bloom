import { Strategy } from "passport-local"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { UserService } from "../../user/user.service"
import { AuthContext } from "../types/auth-context"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: "email",
    })
  }

  async validate(email: string, password: string): Promise<AuthContext> {
    const user = await this.userService.findByEmail(email)
    if (user) {
      const validPassword = await this.userService.verifyUserPassword(user, password)
      if (validPassword && user.confirmedAt) {
        return new AuthContext(user)
      }
    }
    throw new UnauthorizedException()
  }
}
