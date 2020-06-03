import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "../entity/User"
import { Repository } from "typeorm"

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  public async findByEmail(email: string) {
    return this.repo.findOneOrFail({ email })
  }
}
