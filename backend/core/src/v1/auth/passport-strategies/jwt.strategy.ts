import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { Request } from "express"
import { UserService } from "../../user/user.service"
import { AuthService } from "../auth.service"
import { ConfigService } from "@nestjs/config"

function extractTokenFromAuthHeader(req: Request) {
  const authHeader = req.get("Authorization")
  return authHeader.split(" ")[1]
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("APP_SECRET"),
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
