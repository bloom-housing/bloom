import { Injectable } from "@nestjs/common"
import { User } from "../../auth/entities/user.entity"
import { randomBytes, scrypt } from "crypto"
import { SALT_SIZE, SCRYPT_KEYLEN } from "../constants"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export class PasswordService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  // passwordHash is a hidden field - we need to build a query to get it directly
  public async getUserWithPassword(user: User) {
    return await this.userRepository
      .createQueryBuilder()
      .addSelect("user.passwordHash")
      .from(User, "user")
      .where("user.id = :id", { id: user.id })
      .getOne()
  }

  public async isPasswordValid(user: User, password: string) {
    const userWithPassword = await this.getUserWithPassword(user)
    const [salt, savedPasswordHash] = userWithPassword.passwordHash.split("#")
    const verifyPasswordHash = await this.hashPassword(password, Buffer.from(salt, "hex"))
    return savedPasswordHash === verifyPasswordHash
  }

  public async passwordToHash(password: string) {
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
