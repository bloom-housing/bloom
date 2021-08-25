import { Expose } from "class-transformer"
import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { User } from "./user.entity"

@Entity({ name: "user_roles" })
export class UserRoles {
  @OneToOne(() => User, (user) => user.roles, {
    primary: true,
  })
  @JoinColumn()
  user: User

  @Column("boolean", { default: false })
  @Expose()
  isAdmin?: boolean

  @Column("boolean", { default: false })
  @Expose()
  isPartner?: boolean
}
