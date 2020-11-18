import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm"
import { User } from "./user.entity"
import { Listing, ListingStatus } from "./listing.entity"
import {
  IsBoolean,
  IsDefined,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
  IsEnum,
  IsIn,
} from "class-validator"
import { Expose, Type } from "class-transformer"
import { Address } from "../shared/dto/address.dto"
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

export class HousingCounselor {
  @Expose()
  @IsString()
  name: string

  @Expose()
  @IsString({ each: true })
  languages: string[]

  @Expose()
  @IsOptional()
  @IsString()
  address: string | null

  @Expose()
  @IsOptional()
  @IsString()
  citystate: string | null

  @Expose()
  @IsOptional()
  @IsString()
  phone: string | null

  @Expose()
  @IsOptional()
  @IsString()
  website: string | null
}

export class Applicant {
  @Expose()
  @IsString()
  firstName: string

  @Expose()
  @IsString()
  middleName: string

  @Expose()
  @IsString()
  lastName: string

  @Expose()
  @IsString()
  birthMonth: string

  @Expose()
  @IsString()
  birthDay: string

  @Expose()
  @IsString()
  birthYear: string

  @Expose()
  @IsOptional()
  @IsString()
  emailAddress: string | null

  @Expose()
  @IsOptional()
  @IsBoolean()
  noEmail: boolean | null

  @Expose()
  @IsString()
  phoneNumber: string

  @Expose()
  @IsString()
  phoneNumberType: string

  @Expose()
  @IsOptional()
  @IsBoolean()
  noPhone: boolean | null

  @Expose()
  @IsOptional()
  @IsIn(["yes", "no"])
  workInRegion: string | null

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Address)
  workAddress: Address

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Address)
  address: Address
}

export class AlternateContact {
  @Expose()
  @IsString()
  type: string

  @Expose()
  @IsOptional()
  @IsString()
  otherType: string | null

  @Expose()
  @IsString()
  firstName: string

  @Expose()
  @IsString()
  lastName: string

  @Expose()
  @IsOptional()
  @IsString()
  agency: string

  @Expose()
  @IsString()
  phoneNumber: string

  @Expose()
  @IsString()
  emailAddress: string

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Address)
  mailingAddress: Address
}

export class Accessibility {
  @Expose()
  @IsOptional()
  @IsBoolean()
  mobility: boolean | null

  @Expose()
  @IsOptional()
  @IsBoolean()
  vision: boolean | null

  @Expose()
  @IsOptional()
  @IsBoolean()
  hearing: boolean | null
}

export class Demographics {
  @Expose()
  @IsString()
  ethnicity: string

  @Expose()
  @IsString()
  gender: string

  @Expose()
  @IsString()
  sexualOrientation: string

  @Expose()
  @IsString({ each: true })
  howDidYouHear: string[]

  @Expose()
  @IsString()
  race: string
}

export class HouseholdMember {
  @Expose()
  @IsOptional()
  @IsNumber()
  id?: number | null

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Address)
  address: Address

  @Expose()
  @IsString()
  firstName: string

  @Expose()
  @IsString()
  middleName: string

  @Expose()
  @IsString()
  lastName: string

  @Expose()
  @IsString()
  birthMonth: string

  @Expose()
  @IsString()
  birthDay: string

  @Expose()
  @IsString()
  birthYear: string

  @Expose()
  @IsString()
  emailAddress: string

  @Expose()
  @IsOptional()
  @IsBoolean()
  noEmail: boolean | null

  @Expose()
  @IsString()
  phoneNumber: string

  @Expose()
  @IsString()
  phoneNumberType: string

  @Expose()
  @IsOptional()
  @IsBoolean()
  noPhone: boolean | null

  @Expose()
  @IsOptional()
  @IsIn(["yes", "no"])
  sameAddress?: string | null

  @Expose()
  @IsOptional()
  @IsString()
  relationship?: string | null

  @Expose()
  @IsOptional()
  @IsIn(["yes", "no"])
  workInRegion?: string | null

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  workAddress?: Address | null
}

export class ApplicationPreferences {
  @Expose()
  @IsBoolean()
  liveIn: boolean

  @Expose()
  @IsBoolean()
  none: boolean

  @Expose()
  @IsBoolean()
  workIn: boolean
}

export class ApplicationData {
  @Expose()
  @ValidateNested()
  @Type(() => Applicant)
  applicant: Applicant

  @Expose()
  @IsBoolean()
  additionalPhone: boolean

  @Expose()
  @IsString()
  additionalPhoneNumber: string

  @Expose()
  @IsString()
  additionalPhoneNumberType: string

  @Expose()
  @IsString({ each: true })
  contactPreferences: Array<string>

  @Expose()
  @IsNumber()
  householdSize: number

  @Expose()
  @IsString()
  housingStatus: string

  @Expose()
  @IsBoolean()
  sendMailToMailingAddress: boolean

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Address)
  mailingAddress: Address

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Address)
  alternateAddress: Address

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => AlternateContact)
  alternateContact: AlternateContact

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Accessibility)
  accessibility: Accessibility

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Demographics)
  demographics: Demographics

  @Expose()
  @IsBoolean()
  incomeVouchers: boolean

  @Expose()
  @IsString()
  income: string

  @Expose()
  @IsString()
  incomePeriod: string

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => HouseholdMember)
  householdMembers: Array<HouseholdMember>

  @Expose()
  @IsString({ each: true })
  preferredUnit: Array<string>

  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => ApplicationPreferences)
  preferences: ApplicationPreferences

  @Expose()
  @IsEnum(ApplicationStatus)
  @ApiProperty({ enum: ApplicationStatus, enumName: "ApplicationStatus" })
  status: ApplicationStatus

  @Expose()
  @IsEnum(Language)
  @ApiProperty({ enum: Language, enumName: "Language" })
  language: Language

  @Expose()
  @IsEnum(ApplicationSubmissionType)
  @ApiProperty({ enum: ApplicationSubmissionType, enumName: "ApplicationSubmissionType" })
  submissionType: ApplicationSubmissionType

  @Expose()
  @IsOptional()
  @IsBoolean()
  acceptedTerms: boolean | null
}

@Entity({ name: "applications" })
export class Application {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString()
  @IsUUID()
  id: string

  @CreateDateColumn()
  @Expose()
  @IsDate()
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate()
  updatedAt: Date

  @Column({ type: "text", nullable: false })
  @Expose()
  @IsString()
  appUrl: string

  @ManyToOne(() => User, (user) => user.applications, { nullable: true })
  user: User | null

  @ManyToOne(() => Listing, (listing) => listing.applications)
  listing: Listing

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => ApplicationData)
  application: ApplicationData
}
