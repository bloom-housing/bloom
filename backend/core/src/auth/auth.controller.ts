import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common"
import { LocalAuthGuard } from "./local-auth.guard"
import { AuthService } from "./auth.service"
import { UserService } from "../user/user.service"
import { EmailService } from "../shared/email.service"
import { CreateUserDto } from "../user/createUser.dto"
import { DefaultAuthGuard } from "./default.guard"
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger"
import { LoginDto, LoginResponseDto } from "./login.dto"
import { RegisterResponseDto } from "./user.dto"

@Controller("auth")
@ApiTags("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private emailService: EmailService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: "Login", operationId: "login" })
  login(@Request() req): LoginResponseDto {
    const accessToken = this.authService.generateAccessToken(req.user)
    return new LoginResponseDto({ accessToken })
  }

  @Post("register")
  @ApiOperation({ summary: "Register", operationId: "register" })
  async register(@Body() params: CreateUserDto) {
    const user = await this.userService.createUser(params)
    const accessToken = this.authService.generateAccessToken(user)
    // noinspection ES6MissingAwait
    this.emailService.welcome(user)
    return new RegisterResponseDto({ ...user, accessToken })
  }

  @UseGuards(DefaultAuthGuard)
  @Post("token")
  @ApiOperation({ summary: "Token", operationId: "token" })
  token(@Request() req) {
    const accessToken = this.authService.generateAccessToken(req.user)
    return new LoginResponseDto({ accessToken })
  }
}
