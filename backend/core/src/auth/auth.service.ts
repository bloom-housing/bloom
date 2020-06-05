import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { User } from "../entity/User"

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateAccessToken(user: User) {
    const payload = {
      sub: user.id,
    }
    return this.jwtService.sign(payload)
  }
}
