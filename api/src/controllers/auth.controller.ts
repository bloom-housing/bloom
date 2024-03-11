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
import { RequestSingleUseCode } from '../dtos/single-use-code/request-single-use-code.dto';

@Controller('auth')
@ApiTags('auth')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
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
  ): Promise<SuccessDTO> {
    return await this.authService.setCredentials(res, mapTo(User, req['user']));
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

  @Post('request-single-use-code')
  @ApiOperation({
    summary: 'Request single use code',
    operationId: 'requestSingleUseCode',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async requestSingleUseCode(
    @Request() req: ExpressRequest,
    @Body() dto: RequestSingleUseCode,
  ): Promise<SuccessDTO> {
    return await this.authService.requestSingleUseCode(dto, req);
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
