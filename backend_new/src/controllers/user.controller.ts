import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Request,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { User } from '../dtos/users/user.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { IdDTO } from '../dtos/shared/id.dto';
import { mapTo } from '../utilities/mapTo';
import { PaginatedUserDto } from '../dtos/users/paginated-user.dto';
import { UserQueryParams } from '../dtos/users/user-query-param.dto';
import { Request as ExpressRequest } from 'express';
import { UserUpdate } from '../dtos/users/user-update.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { UserCreate } from '../dtos/users/user-create.dto';
import { UserCreateParams } from '../dtos/users/user-create-params.dto';
import { EmailAndAppUrl } from '../dtos/users/email-and-app-url.dto';
import { ConfirmationRequest } from '../dtos/users/confirmation-request.dto';
import { UserInvite } from '../dtos/users/user-invite.dto';

@Controller('user')
@ApiTags('user')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@ApiExtraModels(IdDTO, EmailAndAppUrl)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  profile(@Request() req: ExpressRequest): User {
    return mapTo(User, req.user);
  }

  @Get('/list')
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: PaginatedUserDto })
  @ApiOperation({
    summary: 'Get a paginated set of users',
    operationId: 'list',
  })
  async list(
    @Request() req: ExpressRequest,
    @Query() queryParams: UserQueryParams,
  ): Promise<PaginatedUserDto> {
    return await this.userService.list(queryParams, mapTo(User, req.user));
  }

  @Get(`:id`)
  @ApiOperation({
    summary: 'Get user by id',
    operationId: 'retrieve',
  })
  @ApiOkResponse({ type: User })
  async retrieve(
    @Param('id', new ParseUUIDPipe({ version: '4' })) userId: string,
  ): Promise<User> {
    return this.userService.findOne(userId);
  }

  @Put('forgot-password')
  @ApiOperation({ summary: 'Forgot Password', operationId: 'forgotPassword' })
  @ApiOkResponse({ type: SuccessDTO })
  async forgotPassword(@Body() dto: EmailAndAppUrl): Promise<SuccessDTO> {
    return await this.userService.forgotPassword(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user', operationId: 'update' })
  @ApiOkResponse({ type: User })
  async update(@Body() dto: UserUpdate): Promise<User> {
    return await this.userService.update(dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete user by id', operationId: 'delete' })
  @ApiOkResponse({ type: SuccessDTO })
  async delete(@Body() dto: IdDTO): Promise<SuccessDTO> {
    return await this.userService.delete(dto.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Creates a public only user',
    operationId: 'create',
  })
  @ApiOkResponse({ type: User })
  async create(
    @Body() dto: UserCreate,
    @Query() queryParams: UserCreateParams,
  ): Promise<User> {
    return await this.userService.create(
      dto,
      false,
      queryParams.noWelcomeEmail !== true,
    );
  }

  @Post('/invite')
  @ApiOperation({ summary: 'Invite partner user', operationId: 'invite' })
  @ApiOkResponse({ type: User })
  async invite(@Body() dto: UserInvite): Promise<User> {
    return await this.userService.create(dto, true);
  }

  @Post('resend-confirmation')
  @ApiOperation({
    summary: 'Resend public confirmation',
    operationId: 'resendConfirmation',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async confirmation(@Body() dto: EmailAndAppUrl): Promise<SuccessDTO> {
    return await this.userService.resendConfirmation(dto, false);
  }

  @Post('resend-partner-confirmation')
  @ApiOperation({
    summary: 'Resend partner confirmation',
    operationId: 'resendPartnerConfirmation',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async requestConfirmationResend(
    @Body() dto: EmailAndAppUrl,
  ): Promise<SuccessDTO> {
    return await this.userService.resendConfirmation(dto, true);
  }

  @Post('is-confirmation-token-valid')
  @ApiOperation({
    summary: 'Verifies token is valid',
    operationId: 'isUserConfirmationTokenValid',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async isUserConfirmationTokenValid(
    @Body() dto: ConfirmationRequest,
  ): Promise<SuccessDTO> {
    return await this.userService.isUserConfirmationTokenValid(dto);
  }
}
