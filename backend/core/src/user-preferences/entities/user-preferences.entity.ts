import { User } from "../../../src/auth/entities/user.entity"
import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { Expose } from "class-transformer"

@Entity({ name: "user_preferences" })
export class UserPreferences {
  @OneToOne(() => User, (user) => user.preferences, {
    primary: true,
  })
  @JoinColumn()
  user: User

  @Column("boolean", { default: false })
  @Expose()
  sendEmailNotifications?: boolean

  @Column("boolean", { default: false })
  @Expose()
  sendSmsNotifications?: boolean
}
