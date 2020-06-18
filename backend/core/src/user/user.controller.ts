import { Controller, Request, Get, UseGuards } from "@nestjs/common"
import { DefaultAuthGuard } from "../auth/default.guard"

@Controller("user")
export class UserController {
  @UseGuards(DefaultAuthGuard)
  @Get("profile")
  profile(@Request() req) {
    return req.user
  }
}
