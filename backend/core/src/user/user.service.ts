import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "../entity/user.entity"
import { CreateUserDto } from "./createUser.dto"
import { FindConditions, Repository } from "typeorm"
import { scrypt, randomBytes } from "crypto"

// Length of hashed key, in bytes
const SCRYPT_KEYLEN = 64
const SALT_SIZE = SCRYPT_KEYLEN

const generateSalt = (size = SALT_SIZE) => randomBytes(size)

const hashPassword = (password: string, salt: Buffer) =>
  new Promise((resolve, reject) =>
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

  public async createUser(params: CreateUserDto) {
    const { password } = params
    const user = new User()
    user.firstName = params.firstName
    user.middleName = params.middleName
    user.lastName = params.lastName
    user.dob = params.dob
    user.email = params.email
    try {
      user.passwordHash = await passwordToHash(password)
      await this.repo.save(user)
      return user
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }
}
