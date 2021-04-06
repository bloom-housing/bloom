import {
  Controller,
  Request,
  Get,
  UseGuards,
  Post,
  Body,
  Put,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { EmailDto, UserCreateDto, UserDto, UserUpdateDto } from "./dto/user.dto"
import { UserService } from "./user.service"
import { AuthService } from "../auth/auth.service"
import { EmailService } from "../shared/email.service"
import { ResourceType } from "../auth/resource_type.decorator"
import { authzActions, AuthzService } from "../auth/authz.service"
import { OptionalAuthGuard } from "../auth/optional-auth.guard"
import { mapTo } from "../shared/mapTo"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { AuthzGuard } from "../auth/authz.guard"
import { Request as ExpressRequest } from "express"
import { ForgotPasswordDto, ForgotPasswordResponseDto } from "./dto/forgot_password.dto"
import { UpdatePasswordDto } from "./dto/update_password.dto"
import { LoginResponseDto } from "../auth/dto/login.dto"
import { ConfirmDto } from "./dto/confirm.dto"
import { StatusDto } from "../shared/dto/status.dto"

@Controller("user")
@ApiBearerAuth()
@ApiTags("user")
@ResourceType("user")
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly authzService: AuthzService
  ) {}

  @Get()
  @UseGuards(OptionalAuthGuard, AuthzGuard)
  profile(@Request() req): UserDto {
    return mapTo(UserDto, req.user)
  }

  @Post()
  @UseGuards(OptionalAuthGuard, AuthzGuard)
  @ApiOperation({ summary: "Create user", operationId: "create" })
  async create(@Body() dto: UserCreateDto): Promise<StatusDto> {
    const user = await this.userService.createUser(dto)
    // noinspection ES6MissingAwait
    void this.emailService.welcome(user, dto.appUrl)
    return mapTo(StatusDto, { status: "ok" })
  }

  @Post("resend-confirmation")
  @UseGuards(OptionalAuthGuard, AuthzGuard)
  @ApiOperation({ summary: "Resend confirmation", operationId: "resendConfirmation" })
  async confirmation(@Body() dto: EmailDto): Promise<StatusDto> {
    const user = await this.userService.resendConfirmation(dto)
    // noinspection ES6MissingAwait
    void this.emailService.welcome(user, dto.appUrl)
    return mapTo(StatusDto, { status: "ok" })
  }

  @Put("confirm")
  @ApiOperation({ summary: "Confirm email", operationId: "confirm" })
  async confirm(@Body() dto: ConfirmDto): Promise<LoginResponseDto> {
    const user = await this.userService.confirm(dto)
    const accessToken = this.authService.generateAccessToken(user)
    return mapTo(LoginResponseDto, { accessToken })
  }

  @Put("forgot-password")
  @ApiOperation({ summary: "Forgot Password", operationId: "forgot-password" })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<ForgotPasswordResponseDto> {
    const user = await this.userService.forgotPassword(dto.email)
    void this.emailService.forgotPassword(user, dto.appUrl)
    return mapTo(ForgotPasswordResponseDto, { message: "Email was sent" })
  }

  @Put("update-password")
  @ApiOperation({ summary: "Update Password", operationId: "update-password" })
  async updatePassword(@Body() dto: UpdatePasswordDto): Promise<LoginResponseDto> {
    const user = await this.userService.updatePassword(dto)

    const accessToken = this.authService.generateAccessToken(user)
    return mapTo(LoginResponseDto, { accessToken })
  }

  @Put(":id")
  @UseGuards(OptionalAuthGuard, AuthzGuard)
  @ApiOperation({ summary: "Update user", operationId: "update" })
  async update(@Request() req: ExpressRequest, @Body() dto: UserUpdateDto): Promise<UserDto> {
    const user = await this.userService.find({ id: dto.id })
    if (!user) {
      throw new NotFoundException()
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.authzService.canOrThrow(req.user as any, "user", authzActions.update, {
      ...dto,
    })
    return mapTo(UserDto, await this.userService.update(dto))
  }
}
