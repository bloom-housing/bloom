import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm"
import { User } from "./user.entity"
import { Listing } from "./listing.entity"
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
} from "class-validator"
import { Expose, Type } from "class-transformer"
import { Address } from "../shared/dto/address.dto"

export class HousingCounselor {
  @Expose()
  @IsDefined()
  @IsString()
  name: string

  @Expose()
  @IsDefined()
  @IsString({ each: true })
  languages: string[]

  @Expose()
  @IsOptional()
  @IsString()
  address?: string

  @Expose()
  @IsOptional()
  @IsString()
  citystate?: string

  @Expose()
  @IsOptional()
  @IsString()
  phone?: string

  @Expose()
  @IsOptional()
  @IsString()
  website?: string
}

export class Applicant {
  @Expose()
  @IsDefined()
  @IsString()
  firstName: string

  @Expose()
  @IsDefined()
  @IsString()
  middleName: string

  @Expose()
  @IsDefined()
  @IsString()
  lastName: string

  @Expose()
  @IsDefined()
  @IsNumber()
  birthMonth: number

  @Expose()
  @IsDefined()
  @IsNumber()
  birthDay: number

  @Expose()
  @IsDefined()
  @IsNumber()
  birthYear: number

  @Expose()
  @IsDefined()
  @IsString()
  emailAddress: string

  @Expose()
  @IsDefined()
  @IsBoolean()
  noEmail: boolean

  @Expose()
  @IsDefined()
  @IsString()
  phoneNumber: string

  @Expose()
  @IsDefined()
  @IsString()
  phoneNumberType: string

  @Expose()
  @IsDefined()
  @IsBoolean()
  noPhone: boolean

  @Expose()
  @IsDefined()
  @IsBoolean()
  workInRegion: boolean

  @Expose()
  @IsDefined()
  @ValidateNested()
  workAddress: Address

  @Expose()
  @IsDefined()
  @ValidateNested()
  address: Address
}

export class AlternateContact {
  @Expose()
  @IsDefined()
  @IsString()
  type: string

  @Expose()
  @IsDefined()
  @IsString()
  otherType: string

  @Expose()
  @IsDefined()
  @IsString()
  firstName: string

  @Expose()
  @IsDefined()
  @IsString()
  lastName: string

  @Expose()
  @IsDefined()
  @IsString()
  agency: string

  @Expose()
  @IsDefined()
  @IsString()
  phoneNumber: string

  @Expose()
  @IsDefined()
  @IsString()
  emailAddress: string

  @Expose()
  @IsDefined()
  @ValidateNested()
  mailingAddress: Address
}

export class Accessibility {
  @Expose()
  @IsDefined()
  @IsBoolean()
  mobility: boolean

  @Expose()
  @IsDefined()
  @IsBoolean()
  vision: boolean

  @Expose()
  @IsDefined()
  @IsBoolean()
  hearing: boolean
}

export class Demographics {
  @Expose()
  @IsDefined()
  @IsString()
  ethnicity: string

  @Expose()
  @IsDefined()
  @IsString()
  gender: string

  @Expose()
  @IsDefined()
  @IsString()
  sexualOrientation: string

  @Expose()
  @IsDefined()
  @IsString()
  howDidYouHear: string

  @Expose()
  @IsDefined()
  @IsString()
  race: string
}

export class HouseholdMember {
  @Expose()
  @IsOptional()
  @IsNumber()
  id?: number

  @Expose()
  @IsDefined()
  @ValidateNested()
  address: Address

  @Expose()
  @IsDefined()
  @IsString()
  firstName: string

  @Expose()
  @IsDefined()
  @IsString()
  middleName: string

  @Expose()
  @IsDefined()
  @IsString()
  lastName: string

  @Expose()
  @IsDefined()
  @IsNumber()
  birthMonth: number

  @Expose()
  @IsDefined()
  @IsNumber()
  birthDay: number

  @Expose()
  @IsDefined()
  @IsNumber()
  birthYear: number

  @Expose()
  @IsDefined()
  @IsString()
  emailAddress: string

  @Expose()
  @IsDefined()
  @IsBoolean()
  noEmail: boolean

  @Expose()
  @IsDefined()
  @IsString()
  phoneNumber: string

  @Expose()
  @IsDefined()
  @IsString()
  phoneNumberType: string

  @Expose()
  @IsDefined()
  @IsBoolean()
  noPhone: boolean

  @Expose()
  @IsOptional()
  @IsBoolean()
  sameAddress?: boolean

  @Expose()
  @IsOptional()
  @IsString()
  relationship?: string

  @Expose()
  @IsOptional()
  @IsBoolean()
  workInRegion?: boolean

  @Expose()
  @IsOptional()
  @ValidateNested()
  workAddress?: Address
}

export class ApplicationData {
  @Expose()
  @IsDefined()
  @ValidateNested()
  applicant: Applicant

  @Expose()
  @IsDefined()
  @IsBoolean()
  additionalPhone: boolean

  @Expose()
  @IsDefined()
  @IsString()
  additionalPhoneNumber: string

  @Expose()
  @IsDefined()
  @IsString()
  additionalPhoneNumberType: string

  @Expose()
  @IsDefined()
  @IsString({ each: true })
  contactPreferences: Array<string>

  @Expose()
  @IsDefined()
  @IsNumber()
  householdSize: number

  @Expose()
  @IsDefined()
  @IsString()
  housingStatus: string

  @Expose()
  @IsDefined()
  @IsBoolean()
  sendMailToMailingAddress: boolean

  @Expose()
  @IsDefined()
  @ValidateNested()
  mailingAddress: Address

  @Expose()
  @IsDefined()
  @ValidateNested()
  alternateAddress: Address

  @Expose()
  @IsDefined()
  @ValidateNested()
  alternateContact: AlternateContact

  @Expose()
  @IsDefined()
  @ValidateNested()
  accessibility: Accessibility

  @Expose()
  @IsDefined()
  @ValidateNested()
  demographics: Demographics

  @Expose()
  @IsDefined()
  @IsString()
  incomeVouchers: string

  @Expose()
  @IsDefined()
  @IsString()
  income: string

  @Expose()
  @IsDefined()
  @IsString()
  incomePeriod: string

  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => HouseholdMember)
  householdMembers: Array<HouseholdMember>

  @Expose()
  @IsDefined()
  @IsString({ each: true })
  preferredUnit: Array<string>

  @Expose()
  @IsDefined()
  @IsObject()
  preferences: Record<string, any>
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

  @ManyToOne((type) => User, (user) => user.applications, { nullable: true })
  user: User | null

  @ManyToOne((type) => Listing, (listing) => listing.applications)
  listing: Listing

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsDefined()
  @ValidateNested()
  application: ApplicationData
}
