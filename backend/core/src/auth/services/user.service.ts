import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindConditions, Repository } from "typeorm"
import { paginate, Pagination } from "nestjs-typeorm-paginate"
import { decode, encode } from "jwt-simple"
import moment from "moment"
import crypto from "crypto"
import { User } from "../entities/user.entity"
import { assignDefined } from "../../shared/assign-defined"
import { ConfirmDto } from "../dto/confirm.dto"
import { USER_ERRORS } from "../user-errors"
import { UpdatePasswordDto } from "../dto/update-password.dto"
import { EmailService } from "../../shared/email/email.service"
import { AuthService } from "./auth.service"
import { authzActions, AuthzService } from "./authz.service"
import { ForgotPasswordDto } from "../dto/forgot-password.dto"

import { AuthContext } from "../types/auth-context"
import { PasswordService } from "./password.service"
import { JurisdictionResolverService } from "../../jurisdictions/services/jurisdiction-resolver.service"
import { EmailDto } from "../dto/email.dto"
import { UserCreateDto } from "../dto/user-create.dto"
import { UserUpdateDto } from "../dto/user-update.dto"
import { UserListQueryParams } from "../dto/user-list-query-params"
import { UserInviteDto } from "../dto/user-invite.dto"
import { ConfigService } from "@nestjs/config"
import { JurisdictionDto } from "../../jurisdictions/dto/jurisdiction.dto"

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly authzService: AuthzService,
    private readonly passwordService: PasswordService,
    private readonly jurisdictionResolverService: JurisdictionResolverService
  ) {}

  public async findByEmail(email: string) {
    return this.repo.findOne({ where: { email }, relations: ["leasingAgentInListings"] })
  }

  public async find(options: FindConditions<User>) {
    return this.repo.findOne({ where: options, relations: ["leasingAgentInListings"] })
  }

  public async list(
    params: UserListQueryParams,
    authContext: AuthContext
  ): Promise<Pagination<User>> {
    const options = {
      limit: params.limit === "all" ? undefined : params.limit,
      page: params.page || 10,
    }
    // https://www.npmjs.com/package/nestjs-typeorm-paginate
    const qb = this._getQb()

    const result = await paginate<User>(qb, options)
    /**
     * admin are the only ones that can access all users
     * so this will throw on the first user that isn't their own (non admin users can access themselves)
     */
    await Promise.all(
      result.items.map(async (user) => {
        await this.authzService.canOrThrow(authContext.user, "user", authzActions.read, user)
      })
    )

    return result
  }

  async update(dto: Partial<UserUpdateDto>, authContext: AuthContext) {
    const user = await this.find({
      id: dto.id,
    })
    if (!user) {
      throw new NotFoundException()
    }

    await this.authzService.canOrThrow(authContext.user, "user", authzActions.update, {
      ...dto,
    })

    if (user.confirmedAt?.getTime() !== dto.confirmedAt?.getTime()) {
      await this.authzService.canOrThrow(authContext.user, "user", authzActions.confirm, {
        ...dto,
      })
    }

    let passwordHash
    if (dto.password) {
      if (!dto.currentPassword) {
        // Validation is handled at DTO definition level
        throw new BadRequestException()
      }
      if (!(await this.passwordService.verifyUserPassword(user, dto.currentPassword))) {
        throw new UnauthorizedException("invalidPassword")
      }

      passwordHash = await this.passwordService.passwordToHash(dto.password)
      delete dto.password
    }

    /**
     * jurisdictions should be filtered based off of what the authContext user has
     */
    if (authContext.user.jurisdictions) {
      if (dto.jurisdictions) {
        dto.jurisdictions = dto.jurisdictions.filter(
          (jurisdiction) =>
            authContext.user.jurisdictions.findIndex((val) => val.id === jurisdiction.id) > -1
        )
      }
    } else {
      delete dto.jurisdictions
    }

    assignDefined(user, {
      ...dto,
      passwordHash,
    })

    return await this.repo.save(user)
  }

  public async confirm(dto: ConfirmDto) {
    const user = await this.find({ confirmationToken: dto.token })
    if (!user) {
      throw new HttpException(USER_ERRORS.TOKEN_MISSING.message, USER_ERRORS.TOKEN_MISSING.status)
    }
    const token = decode(dto.token, process.env.APP_SECRET)

    if (token.id !== user.id) {
      throw new HttpException(USER_ERRORS.TOKEN_MISSING.message, USER_ERRORS.TOKEN_MISSING.status)
    }

    user.confirmedAt = new Date()
    user.confirmationToken = null

    if (dto.password) {
      user.passwordHash = await this.passwordService.passwordToHash(dto.password)
    }

    try {
      await this.repo.save(user)
      return this.authService.generateAccessToken(user)
    } catch (err) {
      throw new HttpException(USER_ERRORS.ERROR_SAVING.message, USER_ERRORS.ERROR_SAVING.status)
    }
  }

  public async resendConfirmation(dto: EmailDto) {
    const user = await this.findByEmail(dto.email)
    if (!user) {
      throw new HttpException(USER_ERRORS.NOT_FOUND.message, USER_ERRORS.NOT_FOUND.status)
    }
    if (user.confirmedAt) {
      throw new HttpException(
        USER_ERRORS.ACCOUNT_CONFIRMED.message,
        USER_ERRORS.ACCOUNT_CONFIRMED.status
      )
    } else {
      const payload = { id: user.id, exp: Number.parseInt(moment().add(24, "hours").format("X")) }
      user.confirmationToken = encode(payload, process.env.APP_SECRET)
      try {
        await this.repo.save(user)
        const confirmationUrl = UserService.getConfirmationUrl(dto.appUrl, user)
        await this.emailService.welcome(user, dto.appUrl, confirmationUrl)
        return user
      } catch (err) {
        throw new HttpException(USER_ERRORS.ERROR_SAVING.message, USER_ERRORS.ERROR_SAVING.status)
      }
    }
  }

  private static getConfirmationUrl(appUrl: string, user: User) {
    return `${appUrl}?token=${user.confirmationToken}`
  }

  public async createUser(dto: UserCreateDto, authContext: AuthContext, sendWelcomeEmail = false) {
    if (dto.confirmedAt) {
      await this.authzService.canOrThrow(authContext.user, "user", authzActions.confirm, {
        ...dto,
      })
    }
    let user = await this.findByEmail(dto.email)
    if (user) {
      throw new HttpException(USER_ERRORS.EMAIL_IN_USE.message, USER_ERRORS.EMAIL_IN_USE.status)
    }
    const { password } = dto
    user = new User()
    user.firstName = dto.firstName
    user.middleName = dto.middleName
    user.lastName = dto.lastName
    user.dob = dto.dob
    user.email = dto.email
    user.language = dto.language
    // if coming from partners dto.jurisdictions can be set
    user.jurisdictions = dto.jurisdictions
      ? (dto.jurisdictions as JurisdictionDto[])
      : [await this.jurisdictionResolverService.getJurisdiction()]
    try {
      user.passwordHash = await this.passwordService.passwordToHash(password)
      user = await this.repo.save(user)

      const payload = {
        id: user.id,
        expiresAt: Number.parseInt(moment().add(24, "hours").format("X")),
      }
      user.confirmationToken = encode(payload, process.env.APP_SECRET)
      user = await this.repo.save(user)

      if (sendWelcomeEmail) {
        const confirmationUrl = UserService.getConfirmationUrl(dto.appUrl, user)
        await this.emailService.welcome(user, dto.appUrl, confirmationUrl)
      }

      return user
    } catch (err) {
      throw new HttpException(USER_ERRORS.ERROR_SAVING.message, USER_ERRORS.ERROR_SAVING.status)
    }
  }

  public async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.findByEmail(dto.email)
    if (!user) {
      throw new HttpException(USER_ERRORS.NOT_FOUND.message, USER_ERRORS.NOT_FOUND.status)
    }

    // Token expires in 1 hour
    const payload = { id: user.id, exp: Number.parseInt(moment().add(1, "hour").format("X")) }
    user.resetToken = encode(payload, process.env.APP_SECRET)
    await this.repo.save(user)
    await this.emailService.forgotPassword(user, dto.appUrl)
    return user
  }

  public async updatePassword(dto: UpdatePasswordDto) {
    const user = await this.find({ resetToken: dto.token })
    if (!user) {
      throw new HttpException(USER_ERRORS.TOKEN_MISSING.message, USER_ERRORS.TOKEN_MISSING.status)
    }

    const token = decode(user.resetToken, process.env.APP_SECRET)
    if (token.id !== user.id) {
      throw new HttpException(USER_ERRORS.TOKEN_MISSING.message, USER_ERRORS.TOKEN_MISSING.status)
    }

    user.passwordHash = await this.passwordService.passwordToHash(dto.password)
    user.resetToken = null
    await this.repo.save(user)
    return this.authService.generateAccessToken(user)
  }

  private _getQb() {
    const qb = this.repo.createQueryBuilder("user")
    qb.leftJoinAndSelect("user.leasingAgentInListings", "listings")
    qb.leftJoinAndSelect("user.roles", "user_roles")

    return qb
  }

  async invite(dto: UserInviteDto, authContext: AuthContext) {
    const password = crypto.randomBytes(8).toString("hex")
    let user = await this.createUser(
      {
        ...dto,
        password,
        passwordConfirmation: password,
        emailConfirmation: dto.email,
      },
      authContext,
      false
    )

    user = await this.repo.save({
      ...user,
      roles: dto.roles,
      leasingAgentInListings: dto.leasingAgentInListings,
    })

    await this.emailService.invite(
      user,
      this.configService.get("PARTNERS_PORTAL_URL"),
      UserService.getConfirmationUrl(this.configService.get("PARTNERS_PORTAL_URL"), user)
    )
    return user
  }
}
