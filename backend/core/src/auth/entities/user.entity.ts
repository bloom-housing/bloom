import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm"
import { Listing } from "../../listings/entities/listing.entity"
import { Expose, Type } from "class-transformer"
import { IsDate, IsEmail, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApiProperty } from "@nestjs/swagger"
import { Language } from "../../shared/types/language-enum"
import { UserRoles } from "./user-roles.entity"
import { Jurisdiction } from "../../jurisdictions/entities/jurisdiction.entity"
import { EnforceLowerCase } from "../../shared/decorators/enforceLowerCase.decorator"

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
  @EnforceLowerCase()
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

  @Column("timestamp without time zone", { nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  dob?: Date | null

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

  @ManyToMany(() => Listing, (listing) => listing.leasingAgents, { nullable: true })
  leasingAgentInListings?: Listing[] | null

  @OneToOne(() => UserRoles, (roles) => roles.user, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  @Expose()
  roles?: UserRoles

  @Column({ enum: Language, nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(Language, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: Language, enumName: "Language" })
  language?: Language | null

  @ManyToMany(() => Jurisdiction, { cascade: true, eager: true })
  @JoinTable()
  jurisdictions: Jurisdiction[]
}
