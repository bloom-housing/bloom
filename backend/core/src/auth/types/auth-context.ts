import { User } from "../entities/user.entity"

export class AuthContext {
  constructor(public readonly user?: User) {}
}
