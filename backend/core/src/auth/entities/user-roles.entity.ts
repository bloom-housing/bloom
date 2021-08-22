import { Expose } from "class-transformer"
import { Jurisdiction } from "../../jurisdictions/entities/jurisdiction.entity"
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from "typeorm"
import { User } from "./user.entity"

@Entity({ name: "user_roles" })
export class UserRoles {
  @OneToOne(() => User, (user) => user.roles, {
    primary: true,
    cascade: true,
  })
  @JoinColumn()
  user: User

  @Column("boolean", { default: false })
  @Expose()
  isAdmin?: boolean

  @Column("boolean", { default: false })
  @Expose()
  isPartner?: boolean

  @ManyToMany(() => Jurisdiction)
  @JoinTable()
  jurisdictions: Jurisdiction[]
}
