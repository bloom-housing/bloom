import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Response,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger"
import { ResourceType } from "../decorators/resource-type.decorator"
import { defaultValidationPipeOptions } from "../../shared/default-validation-pipe-options"
import { UserService } from "../services/user.service"
import { OptionalAuthGuard } from "../guards/optional-auth.guard"
import { AuthzGuard } from "../guards/authz.guard"
import { AdminOrJurisdictionalAdminGuard } from "../guards/admin-or-jurisidictional-admin.guard"
import { UserDto } from "../dto/user.dto"
import { mapTo } from "../../shared/mapTo"
import { StatusDto } from "../../shared/dto/status.dto"
import { ConfirmDto } from "../dto/confirm.dto"
import { ForgotPasswordDto } from "../dto/forgot-password.dto"
import { UpdatePasswordDto } from "../dto/update-password.dto"
import { UserBasicDto } from "../dto/user-basic.dto"
import { EmailDto } from "../dto/email.dto"
import { UserCreateDto } from "../dto/user-create.dto"
import { UserUpdateDto } from "../dto/user-update.dto"
import { UserListQueryParams } from "../dto/user-list-query-params"
import { PaginatedUserListDto } from "../dto/paginated-user-list.dto"
import { UserInviteDto } from "../dto/user-invite.dto"
import { ForgotPasswordResponseDto } from "../dto/forgot-password-response.dto"
import { UserCreateQueryParams } from "../dto/user-create-query-params"
import { UserFilterParams } from "../dto/user-filter-params"
import { DefaultAuthGuard } from "../guards/default.guard"
import { UserProfileAuthzGuard } from "../guards/user-profile-authz.guard"
import { ActivityLogInterceptor } from "../../activity-log/interceptors/activity-log.interceptor"
import { IdDto } from "../../shared/dto/id.dto"
import { TOKEN_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "../constants"
import { Response as ExpressResponse } from "express"
@Controller("user")
@ApiBearerAuth()
@ApiTags("user")
@ResourceType("user")
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(DefaultAuthGuard, UserProfileAuthzGuard)
  profile(@Request() req): UserDto {
    return mapTo(UserDto, req.user)
  }

  @Post()
  @UseGuards(OptionalAuthGuard, AuthzGuard)
  @ApiOperation({ summary: "Create user", operationId: "create" })
  async create(
    @Body() dto: UserCreateDto,
    @Query() queryParams: UserCreateQueryParams
  ): Promise<UserBasicDto> {
    return mapTo(
      UserBasicDto,
      await this.userService.createPublicUser(dto, queryParams.noWelcomeEmail !== true)
    )
  }

  @Post("resend-partner-confirmation")
  @UseGuards(OptionalAuthGuard, AuthzGuard)
  @ApiOperation({
    summary: "Resend partner confirmation",
    operationId: "resendPartnerConfirmation",
  })
  async requestConfirmationResend(@Body() dto: EmailDto): Promise<StatusDto> {
    await this.userService.resendPartnerConfirmation(dto)
    return mapTo(StatusDto, { status: "ok" })
  }

  @Post("is-confirmation-token-valid")
  @UseGuards(OptionalAuthGuard, AuthzGuard)
  @ApiOperation({
    summary: "Verifies token is valid",
    operationId: "isUserConfirmationTokenValid",
  })
  async isUserConfirmationTokenValid(@Body() dto: ConfirmDto): Promise<boolean> {
    return await this.userService.isUserConfirmationTokenValid(dto)
  }

  @Post("resend-confirmation")
  @UseGuards(OptionalAuthGuard, AuthzGuard)
  @ApiOperation({ summary: "Resend confirmation", operationId: "resendConfirmation" })
  async confirmation(@Body() dto: EmailDto): Promise<StatusDto> {
    await this.userService.resendPublicConfirmation(dto)
    return mapTo(StatusDto, { status: "ok" })
  }

  @Post("resend-partner-confirmation")
  @UseGuards(OptionalAuthGuard, AuthzGuard)
  @ApiOperation({ summary: "Resend confirmation", operationId: "resendPartnerConfirmation" })
  async resendPartnerConfirmation(@Body() dto: EmailDto): Promise<StatusDto> {
    await this.userService.resendPartnerConfirmation(dto)
    return mapTo(StatusDto, { status: "ok" })
  }

  @Put("confirm")
  @ApiOperation({ summary: "Confirm email", operationId: "confirm" })
  async confirm(
    @Body() dto: ConfirmDto,
    @Response({ passthrough: true }) res: ExpressResponse
  ): Promise<StatusDto> {
    const accessToken = await this.userService.confirm(dto)

    res.cookie(TOKEN_COOKIE_NAME, accessToken, AUTH_COOKIE_OPTIONS)

    return mapTo(StatusDto, { status: "ok" })
  }

  @Put("forgot-password")
  @ApiOperation({ summary: "Forgot Password", operationId: "forgot-password" })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<ForgotPasswordResponseDto> {
    await this.userService.forgotPassword(dto)
    return mapTo(ForgotPasswordResponseDto, { message: "Email was sent" })
  }

  @Put("update-password")
  @ApiOperation({ summary: "Update Password", operationId: "update-password" })
  async updatePassword(
    @Body() dto: UpdatePasswordDto,
    @Response({ passthrough: true }) res: ExpressResponse
  ): Promise<StatusDto> {
    await this.userService.updatePassword(dto, res)
    return mapTo(StatusDto, { status: "ok" })
  }

  @Put(":id")
  @UseGuards(DefaultAuthGuard, AuthzGuard)
  @ApiOperation({ summary: "Update user", operationId: "update" })
  @UseInterceptors(ActivityLogInterceptor)
  async update(@Body() dto: UserUpdateDto): Promise<UserDto> {
    return mapTo(UserDto, await this.userService.update(dto))
  }

  @Get("/list")
  @UseGuards(OptionalAuthGuard, AdminOrJurisdictionalAdminGuard)
  @ApiExtraModels(UserFilterParams)
  @ApiOperation({ summary: "List users", operationId: "list" })
  async list(@Query() queryParams: UserListQueryParams): Promise<PaginatedUserListDto> {
    return mapTo(PaginatedUserListDto, await this.userService.list(queryParams))
  }

  @Post("/invite")
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: "Invite user", operationId: "invite" })
  @UseInterceptors(ActivityLogInterceptor)
  async invite(@Body() dto: UserInviteDto): Promise<UserBasicDto> {
    return mapTo(UserBasicDto, await this.userService.invite(dto))
  }

  @Get(`:id`)
  @ApiOperation({ summary: "Get user by id", operationId: "retrieve" })
  @UseGuards(DefaultAuthGuard, AuthzGuard)
  async retrieve(@Param("id") userId: string): Promise<UserDto> {
    return mapTo(UserDto, await this.userService.findById(userId))
  }

  // codegen generate unusable code for this, if we don't have a body
  @Delete()
  @UseGuards(OptionalAuthGuard, AuthzGuard)
  @ApiOperation({ summary: "Delete user by id", operationId: "delete" })
  @UseInterceptors(ActivityLogInterceptor)
  async delete(@Body() dto: IdDto): Promise<void> {
    return await this.userService.delete(dto.id)
  }
}
