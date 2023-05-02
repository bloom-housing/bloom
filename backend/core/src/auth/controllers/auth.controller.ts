import {
  Controller,
  Request,
  Response,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
} from "@nestjs/common"
import { LocalMfaAuthGuard } from "../guards/local-mfa-auth.guard"
import { AuthService } from "../services/auth.service"
import { DefaultAuthGuard } from "../guards/default.guard"
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger"
import { LoginDto } from "../dto/login.dto"
import { mapTo } from "../../shared/mapTo"
import { defaultValidationPipeOptions } from "../../shared/default-validation-pipe-options"
import { StatusDto } from "../../shared/dto/status.dto"
import { LogoutResponseDto } from "../dto/logout-response.dto"
import { RequestMfaCodeDto } from "../dto/request-mfa-code.dto"
import { RequestMfaCodeResponseDto } from "../dto/request-mfa-code-response.dto"
import { UserService } from "../services/user.service"
import { GetMfaInfoDto } from "../dto/get-mfa-info.dto"
import { GetMfaInfoResponseDto } from "../dto/get-mfa-info-response.dto"
import { UserErrorExtraModel } from "../user-errors"
import { REFRESH_COOKIE_NAME } from "../constants"
import { Response as ExpressResponse } from "express"
import { OptionalAuthGuard } from "../guards/optional-auth.guard"
import { ModuleRef } from "@nestjs/core"

@Controller("auth")
@ApiTags("auth")
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@ApiExtraModels(UserErrorExtraModel)
export class AuthController {
  userService: UserService
  constructor(private readonly authService: AuthService, private moduleRef: ModuleRef) {}

  @UseGuards(LocalMfaAuthGuard)
  @Post("login")
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: "Login", operationId: "login" })
  async login(
    @Request() req,
    @Response({ passthrough: true }) res: ExpressResponse
  ): Promise<StatusDto> {
    return mapTo(StatusDto, await this.authService.tokenGen(res, req.user))
  }

  @UseGuards(DefaultAuthGuard)
  @Get("logout")
  @ApiOperation({ summary: "Logout", operationId: "logout" })
  async logout(@Request() req, @Response({ passthrough: true }) res): Promise<LogoutResponseDto> {
    return mapTo(LogoutResponseDto, await this.authService.tokenClear(res, req.user))
  }

  @Post("request-mfa-code")
  @ApiOperation({ summary: "Request mfa code", operationId: "requestMfaCode" })
  async requestMfaCode(
    @Body() requestMfaCodeDto: RequestMfaCodeDto
  ): Promise<RequestMfaCodeResponseDto> {
    this.userService = await this.moduleRef.resolve(UserService)
    const requestMfaCodeResponse = await this.userService.requestMfaCode(requestMfaCodeDto)
    return mapTo(RequestMfaCodeResponseDto, requestMfaCodeResponse)
  }

  @Post("mfa-info")
  @ApiOperation({ summary: "Get mfa info", operationId: "getMfaInfo" })
  async getMfaInfo(@Body() getMfaInfoDto: GetMfaInfoDto): Promise<GetMfaInfoResponseDto> {
    this.userService = await this.moduleRef.resolve(UserService)
    const getMfaInfoResponseDto = await this.userService.getMfaInfo(getMfaInfoDto)
    return mapTo(GetMfaInfoResponseDto, getMfaInfoResponseDto)
  }

  @Get("requestNewToken")
  @ApiOperation({
    summary: "Requests a new token given a refresh token",
    operationId: "requestNewToken",
  })
  @ApiBearerAuth()
  @UseGuards(OptionalAuthGuard)
  async requestNewToken(
    @Request() req,
    @Response({ passthrough: true }) res: ExpressResponse
  ): Promise<StatusDto> {
    if (!req?.cookies[REFRESH_COOKIE_NAME]) {
      throw new Error("No refresh token sent with request")
    }
    return mapTo(
      StatusDto,
      await this.authService.tokenGen(res, req.user, req.cookies[REFRESH_COOKIE_NAME])
    )
  }
}
