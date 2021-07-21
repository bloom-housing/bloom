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
  Query,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger"
import { EmailDto, UserBasicDto, UserCreateDto, UserDto, UserUpdateDto } from "./dto/user.dto"
import { UserService } from "./user.service"
import { AuthService } from "../auth/auth.service"
import { EmailService } from "../shared/email/email.service"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { authzActions, AuthzService } from "../auth/authz.service"
import { OptionalAuthGuard } from "../auth/guards/optional-auth.guard"
import { mapTo } from "../shared/mapTo"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { Request as ExpressRequest } from "express"
import { ForgotPasswordDto, ForgotPasswordResponseDto } from "./dto/forgot-password.dto"
import { UpdatePasswordDto } from "./dto/update-password.dto"
import { LoginResponseDto } from "../auth/dto/login.dto"
import { ConfirmDto } from "./dto/confirm.dto"
import { StatusDto } from "../shared/dto/status.dto"
import { Expose, Transform } from "class-transformer"
import { IsBoolean, IsOptional } from "class-validator"
import { ValidationsGroupsEnum } from "../shared/types/validations-groups-enum"

export class UserCreateQueryParams {
  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @Transform((value: string | undefined) => value === "true", { toClassOnly: true })
  noWelcomeEmail?: boolean
}

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
  async create(
    @Body() dto: UserCreateDto,
    @Query() queryParams: UserCreateQueryParams
  ): Promise<UserBasicDto> {
    const user = await this.userService.createUser(dto)
    if (!queryParams.noWelcomeEmail) {
      await this.emailService.welcome(user, dto.appUrl)
    }
    return mapTo(UserBasicDto, user)
  }

  @Post("resend-confirmation")
  @UseGuards(OptionalAuthGuard, AuthzGuard)
  @ApiOperation({ summary: "Resend confirmation", operationId: "resendConfirmation" })
  async confirmation(@Body() dto: EmailDto): Promise<StatusDto> {
    const user = await this.userService.resendConfirmation(dto)
    await this.emailService.welcome(user, dto.appUrl)
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
    await this.emailService.forgotPassword(user, dto.appUrl)
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
