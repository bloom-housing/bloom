import { Controller, Request, Post, UseGuards } from "@nestjs/common"
import { LocalAuthGuard } from "./local-auth.guard"
import { AuthService } from "./auth.service"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Request() req) {
    const accessToken = this.authService.generateAccessToken(req.user)
    return { accessToken }
  }
}
