import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm"
import { Application } from "../../applications/entities/application.entity"
import { Listing } from "../../listings/entities/listing.entity"
import { Expose, Type } from "class-transformer"
import { IsDate, IsEmail, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApiProperty } from "@nestjs/swagger"
import { Language } from "../../shared/types/language-enum"
import { UserRole } from "../enum/user-role-enum"

@Entity({ name: "user_accounts" })
@Unique(["email"])
@Index("user_accounts_email_unique_idx", { synchronize: false })
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id: string

  @Column("varchar", { select: false })
  passwordHash: string

  @Column("varchar", { nullable: true })
  resetToken: string

  @Column("varchar", { nullable: true })
  confirmationToken?: string

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  confirmedAt?: Date | null

  @Column("varchar")
  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  email: string

  @Column("varchar")
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  firstName: string

  @Column("varchar", { nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  middleName?: string

  @Column("varchar")
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
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

  @ManyToMany(() => Listing, (listing) => listing.leasingAgents, { nullable: true })
  leasingAgentInListings?: Listing[] | null

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
  @Expose()
  @ApiProperty({ enum: UserRole, enumName: "UserRole", isArray: true })
  get roles(): UserRole[] {
    return [UserRole.user, ...(this.isAdmin ? [UserRole.admin] : [])]
  }

  @Column({ enum: Language, nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(Language, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: Language, enumName: "Language" })
  language?: Language | null
}
