import { Expose } from "class-transformer"
import { IsString, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm"
import { User } from "./user.entity"

@Entity({ name: "user_roles" })
export class UserRoles {
  @PrimaryColumn("uuid")
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  userId: string

  @OneToOne(() => User, (user) => user.roles, {
    primary: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn()
  user: User

  @Column("boolean", { default: false })
  @Expose()
  isAdmin?: boolean

  @Column("boolean", { default: false })
  @Expose()
  isJurisdictionalAdmin?: boolean

  @Column("boolean", { default: false })
  @Expose()
  isPartner?: boolean
}

export class UserRolesOnly {
  @Column("boolean", { default: false })
  @Expose()
  isAdmin?: boolean

  @Column("boolean", { default: false })
  @Expose()
  isJurisdictionalAdmin?: boolean

  @Column("boolean", { default: false })
  @Expose()
  isPartner?: boolean
}
