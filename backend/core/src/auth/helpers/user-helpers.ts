import { Repository } from "typeorm"
import { User } from "../entities/user.entity"

export const getQb = (repo: Repository<User>) => {
  return repo
    .createQueryBuilder("user")
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

export const findByEmail = async (repo: Repository<User>, email: string) => {
  return getQb(repo).where("user.email = :email", { email: email.toLowerCase() }).getOne()
}

export const findById = async (repo: Repository<User>, id: string) => {
  return getQb(repo).where("user.id = :id", { id }).getOne()
}

export const findByConfirmationToken = async (repo: Repository<User>, token: string) => {
  return getQb(repo).where("user.confirmationToken = :token", { token }).getOne()
}

export const findByResetToken = async (repo: Repository<User>, token: string) => {
  return getQb(repo).where("user.resetToken = :token", { token }).getOne()
}
