import {
  Controller,
  Request,
  Response,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
} from "@nestjs/common"
import { LocalMfaAuthGuard } from "../guards/local-mfa-auth.guard"
import { AuthService } from "../services/auth.service"
import { DefaultAuthGuard } from "../guards/default.guard"
import { ApiBody, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger"
import { LoginDto } from "../dto/login.dto"
import { mapTo } from "../../shared/mapTo"
import { defaultValidationPipeOptions } from "../../shared/default-validation-pipe-options"
import { LoginResponseDto } from "../dto/login-response.dto"
import { RequestMfaCodeDto } from "../dto/request-mfa-code.dto"
import { RequestMfaCodeResponseDto } from "../dto/request-mfa-code-response.dto"
import { UserService } from "../services/user.service"
import { GetMfaInfoDto } from "../dto/get-mfa-info.dto"
import { GetMfaInfoResponseDto } from "../dto/get-mfa-info-response.dto"
import { UserErrorExtraModel } from "../user-errors"
import { TokenDto } from "../dto/token.dto"
import { TOKEN_COOKIE_NAME } from "../constants"

@Controller("auth")
@ApiTags("auth")
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@ApiExtraModels(UserErrorExtraModel)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @UseGuards(LocalMfaAuthGuard)
  @Post("login")
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: "Login", operationId: "login" })
  login(@Request() req, @Response({ passthrough: true }) res): LoginResponseDto {
    const accessToken = this.authService.generateAccessToken(req.user)

    res.cookie(TOKEN_COOKIE_NAME, accessToken, { httpOnly: true })
    return mapTo(LoginResponseDto, { success: true })
  }

  @UseGuards(DefaultAuthGuard)
  @Post("token")
  @ApiBody({ type: TokenDto })
  @ApiOperation({ summary: "Token", operationId: "token" })
  token(@Request() req, @Response({ passthrough: true }) res): LoginResponseDto {
    const accessToken = this.authService.generateAccessToken(req.user)

    res.cookie(TOKEN_COOKIE_NAME, accessToken, { httpOnly: true })
    return mapTo(LoginResponseDto, { success: true })
  }

  @Post("request-mfa-code")
  @ApiOperation({ summary: "Request mfa code", operationId: "requestMfaCode" })
  async requestMfaCode(
    @Body() requestMfaCodeDto: RequestMfaCodeDto
  ): Promise<RequestMfaCodeResponseDto> {
    const requestMfaCodeResponse = await this.userService.requestMfaCode(requestMfaCodeDto)
    return mapTo(RequestMfaCodeResponseDto, requestMfaCodeResponse)
  }

  @Post("mfa-info")
  @ApiOperation({ summary: "Get mfa info", operationId: "getMfaInfo" })
  async getMfaInfo(@Body() getMfaInfoDto: GetMfaInfoDto): Promise<GetMfaInfoResponseDto> {
    const getMfaInfoResponseDto = await this.userService.getMfaInfo(getMfaInfoDto)
    return mapTo(GetMfaInfoResponseDto, getMfaInfoResponseDto)
  }
}
