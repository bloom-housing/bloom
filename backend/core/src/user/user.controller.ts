import {
  Controller,
  Request,
  Get,
  UseGuards,
  Post,
  Body,
  Put,
  NotFoundException,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { UserCreateDto, UserDto, UserDtoWithAccessToken, UserUpdateDto } from "./user.dto"
import { UserService } from "./user.service"
import { AuthService } from "../auth/auth.service"
import { EmailService } from "../shared/email.service"
import { ResourceType } from "../auth/resource_type.decorator"
import AuthzGuard from "../auth/authz.guard"
import { authzActions, AuthzService } from "../auth/authz.service"
import { OptionalAuthGuard } from "../auth/optional-auth.guard"
import { mapTo } from "../shared/mapTo"

@Controller("user")
@ApiBearerAuth()
@ResourceType("user")
@UseGuards(OptionalAuthGuard, AuthzGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly authzService: AuthzService
  ) {}

  @Get()
  profile(@Request() req): UserDto {
    return mapTo(UserDto, req.user)
  }

  @Post()
  @ApiOperation({ summary: "Create user", operationId: "create" })
  async create(@Body() dto: UserCreateDto): Promise<UserDtoWithAccessToken> {
    const user = await this.userService.createUser(dto)
    const accessToken = this.authService.generateAccessToken(user)
    // noinspection ES6MissingAwait
    void this.emailService.welcome(user)
    return mapTo(UserDtoWithAccessToken, { ...user, accessToken })
  }

  @Put(":id")
  @ApiOperation({ summary: "Update user", operationId: "update" })
  async update(@Body() dto: UserUpdateDto): Promise<UserDto> {
    const user = await this.userService.find({ id: dto.id })
    if (!user) {
      throw new NotFoundException()
    }
    await this.authzService.canOrThrow(user, "user", authzActions.update, {
      ...dto,
    })
    return mapTo(UserDto, await this.userService.update(dto))
  }
}
