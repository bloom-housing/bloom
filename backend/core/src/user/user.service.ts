import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "../entity/User"
import { Repository } from "typeorm"
import { compare, hash } from "bcrypt"

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  public async findByEmail(email: string) {
    return this.repo.findOne({ email })
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
    const passwordHash = await hash(password, 10)
    await this.repo.update({ passwordHash }, user)
  }

  public async verifyUserPassword(user: User, password: string) {
    const userWithPassword = await this.getUserWithPassword(user)
    return compare(password, userWithPassword.passwordHash)
  }
}
