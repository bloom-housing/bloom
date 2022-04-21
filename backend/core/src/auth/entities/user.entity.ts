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
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator"
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

  @Column({ default: () => "NOW()" })
  @Expose()
  @Type(() => Date)
  passwordUpdatedAt: Date

  @Column({ default: 180 })
  @Expose()
  passwordValidForDays: number

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

  @Column("varchar", { nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsPhoneNumber("US", { groups: [ValidationsGroupsEnum.default] })
  phoneNumber?: string

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
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
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

  @Column({ type: "bool", default: false })
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  mfaEnabled?: boolean

  @Column("varchar", { nullable: true })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  mfaCode?: string

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  mfaCodeUpdatedAt?: Date | null

  @Column({ default: () => "NOW()" })
  @Expose()
  @Type(() => Date)
  lastLoginAt?: Date

  @Column({ default: 0 })
  @Expose()
  @Type(() => Date)
  failedLoginAttemptsCount?: number

  @Column({ type: "bool", nullable: true, default: false })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  phoneNumberVerified?: boolean

  @Column({ type: "bool", nullable: false, default: false })
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  agreedToTermsOfService: boolean

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  hitConfirmationURL?: Date | null
}
