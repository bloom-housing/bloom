import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { User } from "../user/entities/user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { RevokedToken } from "./entities/revoked-token.entity"
import { Repository } from "typeorm"

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(RevokedToken) private readonly revokedTokenRepo: Repository<RevokedToken>
  ) {}

  generateAccessToken(user: User) {
    const payload = {
      sub: user.id,
    }
    return this.jwtService.sign(payload)
  }

  async isRevokedToken(jwt: string) {
    const revoked = await this.revokedTokenRepo.findOne({ token: jwt })
    return Boolean(revoked)
  }
}
