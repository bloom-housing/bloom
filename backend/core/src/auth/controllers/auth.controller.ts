import { Controller, Request, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"
import { LocalAuthGuard } from "../guards/local-auth.guard"
import { AuthService } from "../services/auth.service"
import { DefaultAuthGuard } from "../guards/default.guard"
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger"
import { LoginDto } from "../dto/login.dto"
import { mapTo } from "../../shared/mapTo"
import { defaultValidationPipeOptions } from "../../shared/default-validation-pipe-options"
import { LoginResponseDto } from "../dto/login-response.dto"

@Controller("auth")
@ApiTags("auth")
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: "Login", operationId: "login" })
  login(@Request() req): LoginResponseDto {
    const accessToken = this.authService.generateAccessToken(req.user)
    return mapTo(LoginResponseDto, { accessToken })
  }

  @UseGuards(DefaultAuthGuard)
  @Post("token")
  @ApiOperation({ summary: "Token", operationId: "token" })
  token(@Request() req): LoginResponseDto {
    const accessToken = this.authService.generateAccessToken(req.user)
    return mapTo(LoginResponseDto, { accessToken })
  }
}
