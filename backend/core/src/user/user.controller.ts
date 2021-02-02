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
import { UserCreateDto, UserDto, UserDtoWithAccessToken, UserUpdateDto } from "./dto/user.dto"
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

@Controller("user")
@ApiBearerAuth()
@ApiTags("user")
@ResourceType("user")
@UseGuards(OptionalAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
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
