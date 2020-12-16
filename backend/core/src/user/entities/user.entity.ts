import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Application } from "../../applications/entities/application.entity"
import { Expose, Type } from "class-transformer"
import { IsDate, IsEmail, IsOptional, IsString, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

@Entity({ name: "user_accounts" })
@Index("user_accounts_email_unique_idx", { synchronize: false })
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id: string

  @Column("varchar", { select: false })
  passwordHash: string

  @Column("varchar")
  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  email: string

  @Column("varchar")
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  firstName: string

  @Column("varchar", { nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  middleName?: string

  @Column("varchar")
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  lastName: string

  @Column("timestamp without time zone")
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  dob: Date

  @CreateDateColumn()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt: Date

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[]

  @Column("boolean", { default: false })
  isAdmin: boolean

  /**
   * Array of roles this user can become. Logic is simple right now, but in theory this will expand to take into
   * account membership in a domain (company-level or admin area level for example).
   *
   * In that case, this logic will likely be based on joined entities (another table/entity that keeps track of
   * group membership, for example), and these relations will need to be loaded in order for the list of roles to
   * work properly.
   */
  get roles(): string[] {
    return ["user", ...(this.isAdmin ? ["admin"] : [])]
  }
}
