import { User } from "../../../src/auth/entities/user.entity"
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from "typeorm"
import { Expose, Type } from "class-transformer"
import { Listing } from "../../../src/listings/entities/listing.entity"
import { IsOptional } from "class-validator"
import { ValidationsGroupsEnum } from "../../../src/shared/types/validations-groups-enum"

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

  @ManyToMany(() => Listing, (listing) => listing.favoritedPreferences, { nullable: true })
  @JoinTable()
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Listing)
  favorites?: Listing[] | null
}
