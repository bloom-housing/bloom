import { Strategy } from "passport-jwt"
import { Request } from "express"
import { PassportStrategy } from "@nestjs/passport"
import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { AuthService } from "../services/auth.service"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "../entities/user.entity"
import { Repository } from "typeorm"
import { UserService } from "../services/user.service"
import { USER_ERRORS } from "../user-errors"
import { TOKEN_COOKIE_NAME } from "../constants"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private authService: AuthService,
    private configService: ConfigService
  ) {
    super({
      // eslint-disable-next-line @typescript-eslint/unbound-method
      jwtFromRequest: JwtStrategy.extractJwt,
      passReqToCallback: true,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("APP_SECRET"),
    })
  }

  async validate(req, payload) {
    const rawToken = JwtStrategy.extractJwt(req)
    const isRevoked = await this.authService.isRevokedToken(rawToken)
    if (isRevoked) {
      throw new UnauthorizedException()
    }
    const userId = payload.sub

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["leasingAgentInListings"],
    })

    if (user && UserService.isPasswordOutdated(user)) {
      throw new HttpException(
        {
          message: USER_ERRORS.PASSWORD_OUTDATED.message,
          knownError: true,
        },
        USER_ERRORS.PASSWORD_OUTDATED.status
      )
    }

    const tokenMatch = await this.userRepository
      .createQueryBuilder("user")
      .select("user.id")
      .where("user.id = :id", { id: userId })
      .andWhere("user.activeAccessToken = :accessToken", { accessToken: rawToken })
      .getCount()

    if (!tokenMatch) {
      // if the incoming token is not the active token for the user, clear the user's tokens
      await this.userRepository
        .createQueryBuilder("user")
        .update(User)
        .set({
          activeAccessToken: null,
          activeRefreshToken: null,
        })
        .where("id = :id", { id: userId })
        .execute()
      throw new UnauthorizedException()
    }

    return user
  }

  private static extractJwt(req: Request): string | null {
    if (req.cookies?.[TOKEN_COOKIE_NAME]) {
      return req.cookies[TOKEN_COOKIE_NAME]
    }

    return null
  }
}
