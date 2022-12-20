import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { RevokedToken } from "../entities/revoked-token.entity"
import { User } from "../entities/user.entity"
import {
  AUTH_COOKIE_OPTIONS,
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_OPTIONS,
  TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_AVAILABLE_NAME,
  ACCESS_TOKEN_AVAILABLE_OPTIONS,
} from "../constants"

import { Response } from "express"

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(RevokedToken) private readonly revokedTokenRepo: Repository<RevokedToken>,
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {}

  generateAccessToken(user: User, willBeRefreshToken?: boolean) {
    const payload = {
      sub: user.id,
      expiresIn: willBeRefreshToken ? REFRESH_COOKIE_OPTIONS.maxAge : AUTH_COOKIE_OPTIONS.maxAge,
    }

    return this.jwtService.sign(payload)
  }

  async isRevokedToken(jwt: string) {
    const revoked = await this.revokedTokenRepo.findOne({ token: jwt })
    return Boolean(revoked)
  }

  async tokenGen(res: Response, user: User, incomingRefreshToken?: string) {
    if (!user?.id) {
      throw new Error("no user found")
    }
    if (incomingRefreshToken) {
      // if token is provided, verify that its the correct refresh token
      const userCount = await this.userRepo
        .createQueryBuilder("user")
        .select("user.id")
        .where("user.id = :id", { id: user.id })
        .andWhere("user.activeRefreshToken = :refreshToken", { refreshToken: incomingRefreshToken })
        .getCount()

      if (!userCount) {
        // if the incoming refresh token is not the active refresh token for the user, clear the user's tokens
        await this.userRepo
          .createQueryBuilder("user")
          .update(User)
          .set({
            activeAccessToken: null,
            activeRefreshToken: null,
          })
          .where("id = :id", { id: user.id })
          .execute()

        res.clearCookie(TOKEN_COOKIE_NAME, AUTH_COOKIE_OPTIONS)
        res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS)
        res.clearCookie(ACCESS_TOKEN_AVAILABLE_NAME, ACCESS_TOKEN_AVAILABLE_OPTIONS)

        throw new Error("someone is attempting to use an outdated refresh token")
      }
    }

    const accessToken = this.generateAccessToken(user)
    const newRefreshToken = this.generateAccessToken(user, true)

    // store access and refresh token into db
    await this.userRepo
      .createQueryBuilder("user")
      .update(User)
      .set({
        activeAccessToken: accessToken,
        activeRefreshToken: newRefreshToken,
      })
      .where("id = :id", { id: user.id })
      .execute()

    res.cookie(TOKEN_COOKIE_NAME, accessToken, AUTH_COOKIE_OPTIONS)
    res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, REFRESH_COOKIE_OPTIONS)
    res.cookie(ACCESS_TOKEN_AVAILABLE_NAME, "True", ACCESS_TOKEN_AVAILABLE_OPTIONS)
    return { status: "ok" }
  }

  async tokenClear(res: Response, user: User) {
    if (!user?.id) {
      throw new Error("no user found")
    }
    // clear access and refresh token into db
    await this.userRepo
      .createQueryBuilder("user")
      .update(User)
      .set({
        activeAccessToken: null,
        activeRefreshToken: null,
      })
      .where("id = :id", { id: user.id })
      .execute()

    res.clearCookie(TOKEN_COOKIE_NAME, AUTH_COOKIE_OPTIONS)
    res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS)
    res.clearCookie(ACCESS_TOKEN_AVAILABLE_NAME, ACCESS_TOKEN_AVAILABLE_OPTIONS)
    return { status: "ok" }
  }
}
