import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common"
import { Request } from "express"
import { ConfigService } from "@nestjs/config"
import { AuthService } from "../services/auth.service"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "../entities/user.entity"
import { Repository } from "typeorm"
import { UserService } from "../services/user.service"
import { USER_ERRORS } from "../user-errors"

function extractTokenFromAuthHeader(req: Request) {
  const authHeader = req.get("Authorization")
  return authHeader.split(" ")[1]
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["leasingAgentInListings"],
    })

    if (UserService.isPasswordOutdated(user)) {
      throw new HttpException(
        USER_ERRORS.PASSWORD_OUTDATED.message,
        USER_ERRORS.PASSWORD_OUTDATED.status
      )
    }

    return user
  }
}
