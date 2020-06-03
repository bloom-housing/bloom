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

  public async storeUserPassword(user: User, password: string) {
    const passwordHash = await hash(password, 10)
    await this.repo.update({ passwordHash }, user)
  }

  public verifyUserPassword(user: User, password: string) {
    return compare(password, user.passwordHash)
  }
}
