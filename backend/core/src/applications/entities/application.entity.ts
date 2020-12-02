import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm"
import { User } from "../../entity/user.entity"
import { Listing } from "../../entity/listing.entity"
import {
  IsBoolean,
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
  @Column({ type: "text" })
  @Expose()
  @IsString()
  appUrl: string

  @ManyToOne(() => User, (user) => user.applications, { nullable: true })
  user: User | null

  @ManyToOne(() => Listing, (listing) => listing.applications)
  listing: Listing

  @OneToOne(() => Applicant, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @ValidateNested()
  @Type(() => Applicant)
  applicant: Applicant

  @Column()
  @Expose()
  @IsBoolean()
  additionalPhone: boolean

  @Column()
  @Expose()
  @IsString()
  additionalPhoneNumber: string

  @Column()
  @Expose()
  @IsString()
  additionalPhoneNumberType: string

  @Column("text", { array: true })
  @Expose()
  @IsString({ each: true })
  contactPreferences: string[]

  @Column()
  @Expose()
  @IsNumber()
  householdSize: number

  @Column()
  @Expose()
  @IsString()
  housingStatus: string

  @Column()
  @Expose()
  @IsBoolean()
  sendMailToMailingAddress: boolean

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Address)
  mailingAddress: Address

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Address)
  alternateAddress: Address

  @OneToOne(() => AlternateContact, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => AlternateContact)
  alternateContact: AlternateContact

  @OneToOne(() => Accessibility, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Accessibility)
  accessibility: Accessibility

  @OneToOne(() => Demographics, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Demographics)
  demographics: Demographics

  @Column()
  @Expose()
  @IsBoolean()
  incomeVouchers: boolean

  @Column()
  @Expose()
  @IsString()
  income: string

  @Column({ enum: IncomePeriod })
  @Expose()
  @IsEnum(IncomePeriod)
  @ApiProperty({ enum: IncomePeriod, enumName: "IncomePeriod" })
  incomePeriod: IncomePeriod

  @OneToMany(() => HouseholdMember, (householdMember) => householdMember.application, {
    eager: true,
    cascade: true,
  })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => HouseholdMember)
  householdMembers: HouseholdMember[]

  @Column({ type: "text", array: true })
  @Expose()
  @IsString({ each: true })
  preferredUnit: string[]

  @OneToOne(() => ApplicationPreferences, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => ApplicationPreferences)
  preferences: ApplicationPreferences

  @Column({ enum: ApplicationStatus })
  @Expose()
  @IsEnum(ApplicationStatus)
  @ApiProperty({ enum: ApplicationStatus, enumName: "ApplicationStatus" })
  status: ApplicationStatus

  @Column({ enum: Language })
  @Expose()
  @IsEnum(Language)
  @ApiProperty({ enum: Language, enumName: "Language" })
  language: Language

  @Column({ enum: ApplicationSubmissionType })
  @Expose()
  @IsEnum(ApplicationSubmissionType)
  @ApiProperty({ enum: ApplicationSubmissionType, enumName: "ApplicationSubmissionType" })
  submissionType: ApplicationSubmissionType

  @Column({ enum: ApplicationSubmissionType })
  @Expose()
  @IsOptional()
  @IsBoolean()
  acceptedTerms: boolean | null
}
