import {
  Controller,
  Request,
  Post,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common"
import { LocalAuthGuard } from "./local-auth.guard"
import { AuthService } from "./auth.service"
import { DefaultAuthGuard } from "./default.guard"
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger"
import { LoginDto, LoginResponseDto } from "./login.dto"
import { plainToClass } from "class-transformer"
import { UserService } from "../user/user.service"

@Controller("auth")
@ApiTags("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: "Login", operationId: "login" })
  async login(@Request() req): Promise<LoginResponseDto> {
    const accessToken = this.authService.generateAccessToken(req.user)
    return plainToClass(LoginResponseDto, { accessToken })
  }

  @UseGuards(DefaultAuthGuard)
  @Post("token")
  @ApiOperation({ summary: "Token", operationId: "token" })
  async token(@Request() req): Promise<LoginResponseDto> {
    const accessToken = this.authService.generateAccessToken(req.user)
    return plainToClass(LoginResponseDto, { accessToken })
  }
}
