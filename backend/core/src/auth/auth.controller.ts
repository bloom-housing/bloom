import { Controller, Request, Post, UseGuards, Body, HttpCode } from "@nestjs/common"
import { LocalAuthGuard } from "./local-auth.guard"
import { AuthService } from "./auth.service"
import { UserService } from "../user/user.service"
import { CreateUserDto } from "../user/createUser.dto"
import { DefaultAuthGuard } from "./default.guard"
import { ApiBody } from "@nestjs/swagger"
import { LoginDto, LoginResponseDto } from "./login.dto"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiBody({ type: LoginDto })
  login(@Request() req): LoginResponseDto {
    const accessToken = this.authService.generateAccessToken(req.user)
    return { accessToken }
  }

  @Post("register")
  async register(@Body() params: CreateUserDto) {
    const user = await this.userService.createUser(params)
    const accessToken = this.authService.generateAccessToken(user)
    return { ...user, accessToken }
  }

  @UseGuards(DefaultAuthGuard)
  @Post("token")
  token(@Request() req) {
    const accessToken = this.authService.generateAccessToken(req.user)
    return { accessToken }
  }
}
