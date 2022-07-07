import { EntityRepository, Repository, SelectQueryBuilder } from "typeorm"
import { User } from "../entities/user.entity"

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public getQb(): SelectQueryBuilder<User> {
    return this.createQueryBuilder("user")
      .leftJoin("user.leasingAgentInListings", "leasingAgentInListings")
      .leftJoin("user.jurisdictions", "jurisdictions")
      .leftJoin("user.roles", "userRoles")
      .select([
        "user",
        "jurisdictions.id",
        "userRoles",
        "leasingAgentInListings.id",
        "leasingAgentInListings.name",
      ])
  }

  public async findByEmail(email: string) {
    return this.getQb().where("user.email = :email", { email: email.toLowerCase() }).getOne()
  }

  public async findById(id: string) {
    return this.getQb().where("user.id = :id", { id }).getOne()
  }

  public async findByConfirmationToken(token: string) {
    return this.getQb().where("user.confirmationToken = :token", { token }).getOne()
  }

  public async findByResetToken(token: string) {
    return this.getQb().where("user.resetToken = :token", { token }).getOne()
  }
}
