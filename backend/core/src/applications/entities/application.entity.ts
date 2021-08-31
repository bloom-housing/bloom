import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  RelationId,
} from "typeorm"
import { User } from "../../auth/entities/user.entity"
import { Listing } from "../../listings/entities/listing.entity"
import {
  ArrayMaxSize,
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator"
import { Expose, Type } from "class-transformer"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Applicant } from "./applicant.entity"
import { Address } from "../../shared/entities/address.entity"
import { AlternateContact } from "./alternate-contact.entity"
import { Accessibility } from "./accessibility.entity"
import { Demographics } from "./demographics.entity"
import { HouseholdMember } from "./household-member.entity"
import { ApiProperty } from "@nestjs/swagger"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApplicationPreference } from "./application-preferences.entity"
import { Language } from "../../shared/types/language-enum"
import { ApplicationStatus } from "../types/application-status-enum"
import { ApplicationSubmissionType } from "../types/application-submission-type-enum"
import { IncomePeriod } from "../types/income-period-enum"
import { UnitType } from "../../unit-types/entities/unit-type.entity"

@Entity({ name: "applications" })
export class Application extends AbstractEntity {
  @DeleteDateColumn()
  @Expose()
  @IsOptional()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  deletedAt?: Date | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  appUrl?: string | null

  @ManyToOne(() => User, { nullable: true })
  user: User | null

  @RelationId((application: Application) => application.user)
  @Expose()
  userId?: string

  @ManyToOne(() => Listing, (listing) => listing.applications)
  listing: Listing

  @RelationId((application: Application) => application.listing)
  @Expose()
  listingId: string

  @OneToOne(() => Applicant, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Applicant)
  applicant: Applicant

  @Column({ type: "bool", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  additionalPhone?: boolean | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  additionalPhoneNumber?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  additionalPhoneNumberType?: string | null

  @Column("text", { array: true })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMaxSize(8, { groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default], each: true })
  contactPreferences: string[]

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  householdSize?: number | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  housingStatus?: string | null

  @Column({ type: "bool", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  sendMailToMailingAddress?: boolean | null

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  mailingAddress: Address

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  alternateAddress: Address

  @OneToOne(() => AlternateContact, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AlternateContact)
  alternateContact: AlternateContact

  @OneToOne(() => Accessibility, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Accessibility)
  accessibility: Accessibility

  @OneToOne(() => Demographics, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Demographics)
  demographics: Demographics

  @Column({ type: "bool", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  incomeVouchers?: boolean | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  income?: string | null

  @Column({ enum: IncomePeriod, nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsEnum(IncomePeriod, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: IncomePeriod, enumName: "IncomePeriod" })
  incomePeriod?: IncomePeriod | null

  @OneToMany(() => HouseholdMember, (householdMember) => householdMember.application, {
    eager: true,
    cascade: true,
  })
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMaxSize(32, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => HouseholdMember)
  householdMembers: HouseholdMember[]

  @ManyToMany(() => UnitType, { eager: true, cascade: true })
  @JoinTable()
  @Type(() => UnitType)
  preferredUnit: UnitType[]

  @Column({ type: "jsonb" })
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationPreference)
  preferences: ApplicationPreference[]

  @Column({ enum: ApplicationStatus })
  @Expose()
  @IsEnum(ApplicationStatus, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: ApplicationStatus, enumName: "ApplicationStatus" })
  status: ApplicationStatus

  @Column({ enum: Language, nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsEnum(Language, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: Language, enumName: "Language" })
  language?: Language | null

  @Column({ enum: ApplicationSubmissionType })
  @Expose()
  @IsEnum(ApplicationSubmissionType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: ApplicationSubmissionType, enumName: "ApplicationSubmissionType" })
  submissionType: ApplicationSubmissionType

  @Column({ type: "bool", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  acceptedTerms?: boolean | null

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  submissionDate?: Date | null

  @Column({ type: "bool", default: false })
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  markedAsDuplicate: boolean

  // This is a 'virtual field' needed for CSV export
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  flagged?: boolean
}
