import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm"
import { User } from "../../user/entities/user.entity"
import { Listing } from "../../listings/entities/listing.entity"
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
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
import { ApplicationPreferences } from "./application-preferences.entity"
import { ApiProperty } from "@nestjs/swagger"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"
import { ApplicationFlaggedSet } from "../../application-flagged-sets/entities/application-flagged-set.entity"

export enum ApplicationStatus {
  draft = "draft",
  submitted = "submitted",
  removed = "removed",
}

export enum ApplicationSubmissionType {
  paper = "paper",
  electronical = "electronical",
}

export enum Language {
  en = "en",
  es = "es",
}

export enum IncomePeriod {
  perMonth = "perMonth",
  perYear = "perYear",
}

@Entity({ name: "applications" })
export class Application extends AbstractEntity {
  static createQueryBuilder(arg0: string) {
    throw new Error("Method not implemented.")
  }
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
  appUrl?: string | null

  @ManyToOne(() => User, (user) => user.applications, { nullable: true })
  user: User | null

  @ManyToOne(() => Listing, (listing) => listing.applications)
  listing: Listing

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
  additionalPhoneNumber?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  additionalPhoneNumberType?: string | null

  @Column("text", { array: true })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
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
  @Type(() => HouseholdMember)
  householdMembers: HouseholdMember[]

  @Column({ type: "text", array: true })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  preferredUnit: string[]

  @OneToOne(() => ApplicationPreferences, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicationPreferences)
  preferences: ApplicationPreferences

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

  @ManyToMany(() => ApplicationFlaggedSet, (afs) => afs.applications)
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicationFlaggedSet)
  applicationFlaggedSets: ApplicationFlaggedSet[]
}
