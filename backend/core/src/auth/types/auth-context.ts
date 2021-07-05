import { User } from "../../user/entities/user.entity"

export class AuthContext {
  user?: User

  constructor(user?: User) {
    this.user = user
  }
}
