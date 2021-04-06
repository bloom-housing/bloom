import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "./entities/user.entity"
import { FindConditions, Repository } from "typeorm"
import { scrypt, randomBytes } from "crypto"
import { EmailDto, UserCreateDto, UserDto } from "./dto/user.dto"
import { encode, decode } from "jwt-simple"
import moment from "moment"
import { UpdatePasswordDto } from "./dto/update_password.dto"
import { ConfirmDto } from "./dto/confirm.dto"

// Length of hashed key, in bytes
const SCRYPT_KEYLEN = 64
const SALT_SIZE = SCRYPT_KEYLEN
export const USER_ERRORS = {
  ACCOUNT_CONFIRMED: { message: "accountConfirmed", status: HttpStatus.NOT_ACCEPTABLE },
  ERROR_SAVING: { message: "errorSaving", status: HttpStatus.BAD_REQUEST },
  NOT_FOUND: { message: "emailNotFound", status: HttpStatus.NOT_FOUND },
  TOKEN_EXPIRED: { message: "tokenExpired", status: HttpStatus.BAD_REQUEST },
  TOKEN_MISSING: { message: "tokenMissing", status: HttpStatus.BAD_REQUEST },
  EMAIL_IN_USE: { message: "emailInUse", status: HttpStatus.BAD_REQUEST },
}

const generateSalt = (size = SALT_SIZE) => randomBytes(size)

const hashPassword = (password: string, salt: Buffer) =>
  new Promise<string>((resolve, reject) =>
    scrypt(password, salt, SCRYPT_KEYLEN, (err, key) =>
      err ? reject(err) : resolve(key.toString("hex"))
    )
  )

const passwordToHash = async (password: string) => {
  const salt = generateSalt()
  const hash = await hashPassword(password, salt)
  return `${salt.toString("hex")}#${hash}`
}

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  public async findByEmail(email: string) {
    return this.repo.findOne({ email })
  }

  public async find(options: FindConditions<User>) {
    return this.repo.findOne(options)
  }

  async update(dto: Partial<UserDto>) {
    const obj = await this.repo.findOne({
      where: {
        id: dto.id,
      },
    })
    if (!obj) {
      throw new NotFoundException()
    }
    Object.assign(obj, dto)
    return await this.repo.save(obj)
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

  public async storeUserPassword(user: User, password: string) {
    const passwordHash = await passwordToHash(password)
    await this.repo.update({ passwordHash }, user)
  }

  public async verifyUserPassword(user: User, password: string) {
    const userWithPassword = await this.getUserWithPassword(user)
    const [salt, savedPasswordHash] = userWithPassword.passwordHash.split("#")
    const verifyPasswordHash = await hashPassword(password, Buffer.from(salt, "hex"))
    return savedPasswordHash === verifyPasswordHash
  }

  public async confirm(dto: ConfirmDto) {
    const user = await this.repo.findOne({ confirmationToken: dto.token })
    if (!user) {
      throw new HttpException(USER_ERRORS.TOKEN_MISSING.message, USER_ERRORS.TOKEN_MISSING.status)
    }
    const payload = decode(dto.token, process.env.SECRET)
    if (moment(payload.expiresAt) < moment()) {
      throw new HttpException(USER_ERRORS.TOKEN_EXPIRED.message, USER_ERRORS.TOKEN_EXPIRED.status)
    }
    user.confirmedAt = new Date()
    user.confirmationToken = null

    try {
      await this.repo.save(user)
      return user
    } catch (err) {
      throw new HttpException(USER_ERRORS.EMAIL_IN_USE.message, USER_ERRORS.EMAIL_IN_USE.status)
    }
  }

  public async resendConfirmation(dto: EmailDto) {
    const user = await this.findByEmail(dto.email)
    if (user) {
      if (!user.confirmedAt) {
        const payload = { id: user.id, expiresAt: moment().add(24, "hours") }
        const token = encode(payload, process.env.SECRET)
        user.confirmationToken = token
        try {
          await this.repo.save(user)
          return user
        } catch (err) {
          throw new HttpException(USER_ERRORS.ERROR_SAVING.message, USER_ERRORS.ERROR_SAVING.status)
        }
      } else {
        throw new HttpException(
          USER_ERRORS.ACCOUNT_CONFIRMED.message,
          USER_ERRORS.ACCOUNT_CONFIRMED.status
        )
      }
    } else {
      throw new HttpException(USER_ERRORS.NOT_FOUND.message, USER_ERRORS.NOT_FOUND.status)
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
    const payload = { id: user.id, expiresAt: moment().add(24, "hours") }
    const token = encode(payload, process.env.SECRET)
    user.confirmationToken = token
    try {
      user.passwordHash = await passwordToHash(password)
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
    const token = encode(payload, process.env.SECRET)
    user.resetToken = token
    await this.repo.save(user)

    return user
  }

  public async updatePassword(dto: UpdatePasswordDto) {
    const user = await this.repo.findOne({ resetToken: dto.token })
    if (!user) {
      throw new HttpException(USER_ERRORS.TOKEN_MISSING.message, USER_ERRORS.TOKEN_MISSING.status)
    }
    const payload = decode(user.resetToken, process.env.SECRET)
    if (moment(payload.expiresAt) < moment()) {
      throw new HttpException(USER_ERRORS.TOKEN_EXPIRED.message, USER_ERRORS.TOKEN_EXPIRED.status)
    }
    user.passwordHash = await passwordToHash(dto.password)
    user.resetToken = null
    await this.repo.save(user)

    return user
  }
}
