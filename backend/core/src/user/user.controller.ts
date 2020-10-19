import { Controller, Request, Get, UseGuards, Post, Body } from "@nestjs/common"
import { DefaultAuthGuard } from "../auth/default.guard"
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { CreateUserDto } from "./createUser.dto"
import { RegisterResponseDto } from "../auth/user.dto"
import { plainToClass } from "class-transformer"
import { UserService } from "./user.service"
import { AuthService } from "../auth/auth.service"
import { EmailService } from "../shared/email.service"
import { User } from "../entity/user.entity"

@Controller("user")
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService
  ) {}

  @UseGuards(DefaultAuthGuard)
  @Get("profile")
  profile(@Request() req): User {
    return req.user
  }

  @Post("create")
  @ApiOperation({ summary: "Create", operationId: "create" })
  async create(@Body() params: CreateUserDto): Promise<RegisterResponseDto> {
    const user = await this.userService.createUser(params)
    const accessToken = this.authService.generateAccessToken(user)
    // noinspection ES6MissingAwait
    this.emailService.welcome(user)
    return plainToClass(
      RegisterResponseDto,
      { ...user, accessToken },
      { excludeExtraneousValues: true }
    )
  }
}
