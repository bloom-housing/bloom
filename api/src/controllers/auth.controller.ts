import {
  Controller,
  Get,
  Request,
  Response,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  BadRequestException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { AuthService, REFRESH_COOKIE_NAME } from '../services/auth.service';
import { RequestMfaCode } from '../dtos/mfa/request-mfa-code.dto';
import { RequestMfaCodeResponse } from '../dtos/mfa/request-mfa-code-response.dto';
import { Confirm } from '../dtos/auth/confirm.dto';
import { UpdatePassword } from '../dtos/auth/update-password.dto';
import { MfaAuthGuard } from '../guards/mfa.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { OptionalAuthGuard } from '../guards/optional.guard';
import { Login } from '../dtos/auth/login.dto';
import { mapTo } from '../utilities/mapTo';
import { User } from '../dtos/users/user.dto';
import { LoginViaSingleUseCode } from '../dtos/auth/login-single-use-code.dto';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { SingleUseCodeAuthGuard } from '../guards/single-use-code.guard';

@Controller('auth')
@ApiTags('auth')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@UseGuards(ApiKeyGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login', operationId: 'login' })
  @ApiOkResponse({ type: SuccessDTO })
  @ApiBody({ type: Login })
  @UseGuards(MfaAuthGuard)
  async login(
    @Request() req: ExpressRequest,
    @Response({ passthrough: true }) res: ExpressResponse,
    @Body() dto: Login,
  ): Promise<SuccessDTO> {
    return await this.authService.setCredentials(
      res,
      mapTo(User, req['user']),
      undefined,
      dto.reCaptchaToken,
      !!process.env.RECAPTCHA_KEY,
      !!dto.mfaCode,
      process.env.ENABLE_RECAPTCHA === 'TRUE',
      dto.agreedToTermsOfService,
    );
  }

  @Post('loginViaSingleUseCode')
  @ApiOperation({
    summary: 'LoginViaSingleUseCode',
    operationId: 'login via a single use code',
  })
  @ApiOkResponse({ type: SuccessDTO })
  @ApiBody({ type: LoginViaSingleUseCode })
  @UseGuards(SingleUseCodeAuthGuard)
  async loginViaSingleUseCode(
    @Request() req: ExpressRequest,
    @Response({ passthrough: true }) res: ExpressResponse,
    @Body() dto: LoginViaSingleUseCode,
  ): Promise<SuccessDTO> {
    return await this.authService.confirmAndSetCredentials(
      mapTo(User, req['user']),
      res,
      dto.agreedToTermsOfService,
    );
  }

  @Get('logout')
  @ApiOperation({ summary: 'Logout', operationId: 'logout' })
  @ApiOkResponse({ type: SuccessDTO })
  @UseGuards(JwtAuthGuard)
  async logout(
    @Request() req: ExpressRequest,
    @Response({ passthrough: true }) res: ExpressResponse,
  ): Promise<SuccessDTO> {
    return await this.authService.clearCredentials(
      res,
      mapTo(User, req['user']),
    );
  }

  @Post('request-mfa-code')
  @ApiOperation({ summary: 'Request mfa code', operationId: 'requestMfaCode' })
  @ApiOkResponse({ type: RequestMfaCodeResponse })
  async requestMfaCode(
    @Body() dto: RequestMfaCode,
  ): Promise<RequestMfaCodeResponse> {
    return await this.authService.requestMfaCode(dto);
  }

  @Get('requestNewToken')
  @ApiOperation({
    summary: 'Requests a new token given a refresh token',
    operationId: 'requestNewToken',
  })
  @ApiOkResponse({ type: SuccessDTO })
  @UseGuards(OptionalAuthGuard)
  async requestNewToken(
    @Request() req: ExpressRequest,
    @Response({ passthrough: true }) res: ExpressResponse,
  ): Promise<SuccessDTO> {
    if (!req?.cookies[REFRESH_COOKIE_NAME]) {
      throw new BadRequestException('No refresh token sent with request');
    }
    return await this.authService.setCredentials(
      res,
      mapTo(User, req['user']),
      req.cookies[REFRESH_COOKIE_NAME],
    );
  }

  @Put('update-password')
  @ApiOperation({ summary: 'Update Password', operationId: 'update-password' })
  @ApiOkResponse({ type: SuccessDTO })
  async updatePassword(
    @Body() dto: UpdatePassword,
    @Response({ passthrough: true }) res: ExpressResponse,
  ): Promise<SuccessDTO> {
    return await this.authService.updatePassword(dto, res);
  }

  @Put('confirm')
  @ApiOperation({ summary: 'Confirm email', operationId: 'confirm' })
  @ApiOkResponse({ type: SuccessDTO })
  async confirm(
    @Body() dto: Confirm,
    @Response({ passthrough: true }) res: ExpressResponse,
  ): Promise<SuccessDTO> {
    return await this.authService.confirmUser(dto, res);
  }
}
