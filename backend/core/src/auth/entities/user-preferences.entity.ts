import { User } from "./user.entity"
import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { Expose } from "class-transformer"
import { IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

@Entity({ name: "user_preferences" })
export class UserPreferences {
  @OneToOne(() => User, (user) => user.preferences, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: User

  @Column("boolean", { default: false })
  @Expose()
  sendEmailNotifications?: boolean

  @Column("boolean", { default: false })
  @Expose()
  sendSmsNotifications?: boolean

  @Column("text", { array: true, default: [] })
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @Expose()
  favoriteIds?: string[]
}
