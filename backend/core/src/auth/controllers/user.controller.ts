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
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Request as ExpressRequest } from "express"
import { ResourceType } from "../decorators/resource-type.decorator"
import { defaultValidationPipeOptions } from "../../shared/default-validation-pipe-options"
import { UserService } from "../services/user.service"
import { OptionalAuthGuard } from "../guards/optional-auth.guard"
import { AuthzGuard } from "../guards/authz.guard"
import { UserDto } from "../dto/user.dto"
import { mapTo } from "../../shared/mapTo"
import { StatusDto } from "../../shared/dto/status.dto"
import { ConfirmDto } from "../dto/confirm.dto"
import { ForgotPasswordDto } from "../dto/forgot-password.dto"
import { UpdatePasswordDto } from "../dto/update-password.dto"
import { AuthContext } from "../types/auth-context"
import { User } from "../entities/user.entity"
import { ResourceAction } from "../decorators/resource-action.decorator"
import { UserBasicDto } from "../dto/user-basic.dto"
import { EmailDto } from "../dto/email.dto"
import { UserCreateDto } from "../dto/user-create.dto"
import { UserUpdateDto } from "../dto/user-update.dto"
import { UserListQueryParams } from "../dto/user-list-query-params"
import { PaginatedUserListDto } from "../dto/paginated-user-list.dto"
import { UserInviteDto } from "../dto/user-invite.dto"
import { ForgotPasswordResponseDto } from "../dto/forgot-password-response.dto"
import { LoginResponseDto } from "../dto/login-response.dto"
import { authzActions } from "../enum/authz-actions.enum"
import { UserCreateQueryParams } from "../dto/user-create-query-params"
import { UserFilterParams } from "../dto/user-filter-params"
import { DefaultAuthGuard } from "../guards/default.guard"
import { UserProfileAuthzGuard } from "../guards/user-profile-authz.guard"
import { ActivityLogInterceptor } from "../../activity-log/interceptors/activity-log.interceptor"

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
    @Request() req: ExpressRequest,
    @Body() dto: UserCreateDto,
    @Query() queryParams: UserCreateQueryParams
  ): Promise<UserBasicDto> {
    return mapTo(
      UserBasicDto,
      await this.userService.createPublicUser(
        dto,
        new AuthContext(req.user as User),
        queryParams.noWelcomeEmail !== true
      )
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
  async confirm(@Body() dto: ConfirmDto): Promise<LoginResponseDto> {
    const accessToken = await this.userService.confirm(dto)
    return mapTo(LoginResponseDto, { accessToken })
  }

  @Put("forgot-password")
  @ApiOperation({ summary: "Forgot Password", operationId: "forgot-password" })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<ForgotPasswordResponseDto> {
    await this.userService.forgotPassword(dto)
    return mapTo(ForgotPasswordResponseDto, { message: "Email was sent" })
  }

  @Put("update-password")
  @ApiOperation({ summary: "Update Password", operationId: "update-password" })
  async updatePassword(@Body() dto: UpdatePasswordDto): Promise<LoginResponseDto> {
    const accessToken = await this.userService.updatePassword(dto)
    return mapTo(LoginResponseDto, { accessToken })
  }

  @Put(":id")
  @UseGuards(DefaultAuthGuard, AuthzGuard)
  @ApiOperation({ summary: "Update user", operationId: "update" })
  @UseInterceptors(ActivityLogInterceptor)
  async update(@Request() req: ExpressRequest, @Body() dto: UserUpdateDto): Promise<UserDto> {
    return mapTo(UserDto, await this.userService.update(dto, new AuthContext(req.user as User)))
  }

  @Get("/list")
  @UseGuards(OptionalAuthGuard, AuthzGuard)
  @ApiExtraModels(UserFilterParams)
  @ApiOperation({ summary: "List users", operationId: "list" })
  async list(
    @Query() queryParams: UserListQueryParams,
    @Request() req: ExpressRequest
  ): Promise<PaginatedUserListDto> {
    return mapTo(
      PaginatedUserListDto,
      await this.userService.list(queryParams, new AuthContext(req.user as User))
    )
  }

  @Post("/invite")
  @UseGuards(OptionalAuthGuard, AuthzGuard)
  @ApiOperation({ summary: "Invite user", operationId: "invite" })
  @ResourceAction(authzActions.invite)
  @UseInterceptors(ActivityLogInterceptor)
  async invite(@Request() req: ExpressRequest, @Body() dto: UserInviteDto): Promise<UserBasicDto> {
    return mapTo(
      UserBasicDto,
      await this.userService.invitePartnersPortalUser(dto, new AuthContext(req.user as User))
    )
  }

  @Get(`:id`)
  @ApiOperation({ summary: "Get user by id", operationId: "retrieve" })
  @UseGuards(DefaultAuthGuard, AuthzGuard)
  async retrieve(@Param("id") userId: string): Promise<UserDto> {
    return mapTo(UserDto, await this.userService.findById(userId))
  }

  @Delete(`:id`)
  @UseGuards(OptionalAuthGuard, AuthzGuard)
  @ApiOperation({ summary: "Delete user by id", operationId: "delete" })
  @UseInterceptors(ActivityLogInterceptor)
  async delete(@Param("id") userId: string): Promise<void> {
    return await this.userService.delete(userId)
  }
}
