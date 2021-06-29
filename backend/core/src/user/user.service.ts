import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "./entities/user.entity"
import { FindConditions, Repository } from "typeorm"
import { randomBytes, scrypt } from "crypto"
import { EmailDto, UserCreateDto, UserUpdateDto } from "./dto/user.dto"
import { decode, encode } from "jwt-simple"
import moment from "moment"
import { UpdatePasswordDto } from "./dto/update-password.dto"
import { ConfirmDto } from "./dto/confirm.dto"
import { assignDefined } from "../shared/assign-defined"
import { SALT_SIZE, SCRYPT_KEYLEN } from "./constants"
import { USER_ERRORS } from "./user-errors"

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  public async findByEmail(email: string) {
    return this.repo.findOne({ where: { email }, relations: ["leasingAgentInListings"] })
  }

  public async find(options: FindConditions<User>) {
    return this.repo.findOne({ where: options, relations: ["leasingAgentInListings"] })
  }

  async update(dto: Partial<UserUpdateDto>) {
    const user = await this.find({
      id: dto.id,
    })
    if (!user) {
      throw new NotFoundException()
    }

    let passwordHash
    if (dto.password) {
      if (!dto.currentPassword) {
        // Validation is handled at DTO definition level
        throw new BadRequestException()
      }
      if (!(await this.verifyUserPassword(user, dto.currentPassword))) {
        throw new UnauthorizedException("invalidPassword")
      }

      passwordHash = await this.passwordToHash(dto.password)
      delete dto.password
    }

    assignDefined(user, {
      ...dto,
      passwordHash,
    })

    return await this.repo.save(user)
  }

  // passwordHash is a hidden field - we need to build a query to get it directly
  public async getUserWithPassword(user: User) {
    return await this.repo
      .createQueryBuilder()
      .addSelect("user.passwordHash")
      .from(User, "user")
      .where("user.id = :id", { id: user.id })
      .getOne()
  }

  public async verifyUserPassword(user: User, password: string) {
    const userWithPassword = await this.getUserWithPassword(user)
    const [salt, savedPasswordHash] = userWithPassword.passwordHash.split("#")
    const verifyPasswordHash = await this.hashPassword(password, Buffer.from(salt, "hex"))
    return savedPasswordHash === verifyPasswordHash
  }

  public async confirm(dto: ConfirmDto) {
    const user = await this.find({ confirmationToken: dto.token })
    if (!user) {
      throw new HttpException(USER_ERRORS.TOKEN_MISSING.message, USER_ERRORS.TOKEN_MISSING.status)
    }
    const payload = decode(dto.token, process.env.APP_SECRET)
    if (moment(payload.expiresAt) < moment()) {
      throw new HttpException(USER_ERRORS.TOKEN_EXPIRED.message, USER_ERRORS.TOKEN_EXPIRED.status)
    }
    user.confirmedAt = new Date()
    user.confirmationToken = null

    try {
      await this.repo.save(user)
      return user
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
      const payload = { id: user.id, expiresAt: moment().add(24, "hours") }
      const token = encode(payload, process.env.APP_SECRET)
      user.confirmationToken = token
      try {
        await this.repo.save(user)
        return user
      } catch (err) {
        throw new HttpException(USER_ERRORS.ERROR_SAVING.message, USER_ERRORS.ERROR_SAVING.status)
      }
    }
  }

  public async createUser(dto: UserCreateDto) {
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
    const payload = { id: user.id, expiresAt: moment().add(24, "hours") }
    const token = encode(payload, process.env.APP_SECRET)
    user.confirmationToken = token
    try {
      user.passwordHash = await this.passwordToHash(password)
      await this.repo.save(user)
      return user
    } catch (err) {
      throw new HttpException(USER_ERRORS.EMAIL_IN_USE.message, USER_ERRORS.EMAIL_IN_USE.status)
    }
  }

  public async forgotPassword(email: string) {
    const user = await this.findByEmail(email)
    if (!user) {
      throw new HttpException(USER_ERRORS.NOT_FOUND.message, USER_ERRORS.NOT_FOUND.status)
    }

    // Token expires in 24 hours
    const payload = { id: user.id, expiresAt: moment().add(1, "hour") }
    const token = encode(payload, process.env.APP_SECRET)
    user.resetToken = token
    await this.repo.save(user)

    return user
  }

  public async updatePassword(dto: UpdatePasswordDto) {
    const user = await this.find({ resetToken: dto.token })
    if (!user) {
      throw new HttpException(USER_ERRORS.TOKEN_MISSING.message, USER_ERRORS.TOKEN_MISSING.status)
    }
    const payload = decode(user.resetToken, process.env.APP_SECRET)
    if (moment(payload.expiresAt) < moment()) {
      throw new HttpException(USER_ERRORS.TOKEN_EXPIRED.message, USER_ERRORS.TOKEN_EXPIRED.status)
    }
    user.passwordHash = await this.passwordToHash(dto.password)
    user.resetToken = null
    await this.repo.save(user)

    return user
  }

  private async passwordToHash(password: string) {
    const salt = this.generateSalt()
    const hash = await this.hashPassword(password, salt)
    return `${salt.toString("hex")}#${hash}`
  }

  private async hashPassword(password: string, salt: Buffer) {
    return new Promise<string>((resolve, reject) =>
      scrypt(password, salt, SCRYPT_KEYLEN, (err, key) =>
        err ? reject(err) : resolve(key.toString("hex"))
      )
    )
  }

  private generateSalt(size = SALT_SIZE) {
    return randomBytes(size)
  }
}
