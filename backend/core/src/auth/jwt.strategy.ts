import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { Request } from "express"
import { secretKey } from "./constants"
import { UserService } from "../user/user.service"
import { AuthService } from "./auth.service"

function extractTokenFromAuthHeader(req: Request) {
  const authHeader = req.get("Authorization")
  return authHeader.split(" ")[1]
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      ignoreExpiration: false,
      secretOrKey: secretKey,
    })
  }

  async validate(req, payload) {
    const rawToken = extractTokenFromAuthHeader(req)
    const isRevoked = await this.authService.isRevokedToken(rawToken)
    if (isRevoked) {
      throw new UnauthorizedException()
    }
    const userId = payload.sub
    return this.userService.find({ id: userId })
  }
}
