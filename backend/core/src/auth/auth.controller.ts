import { Controller, Request, Post, UseGuards } from "@nestjs/common"
import { LocalAuthGuard } from "./local-auth.guard"

@Controller("auth")
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Request() req) {
    return req.user
  }
}
