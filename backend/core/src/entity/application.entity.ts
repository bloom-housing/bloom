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
  @IsNumber()
  birthMonth: number

  @Expose()
  @IsNumber()
  birthDay: number

  @Expose()
  @IsNumber()
  birthYear: number

  @Expose()
  @IsString()
  emailAddress: string

  @Expose()
  @IsBoolean()
  noEmail: boolean

  @Expose()
  @IsString()
  phoneNumber: string

  @Expose()
  @IsString()
  phoneNumberType: string

  @Expose()
  @IsBoolean()
  noPhone: boolean

  @Expose()
  @IsOptional()
  @IsBoolean()
  workInRegion: boolean | null

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
  @IsString()
  otherType: string

  @Expose()
  @IsString()
  firstName: string

  @Expose()
  @IsString()
  lastName: string

  @Expose()
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
  @IsString()
  howDidYouHear: string

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
  @IsNumber()
  birthMonth: number

  @Expose()
  @IsNumber()
  birthDay: number

  @Expose()
  @IsNumber()
  birthYear: number

  @Expose()
  @IsString()
  emailAddress: string

  @Expose()
  @IsBoolean()
  noEmail: boolean

  @Expose()
  @IsString()
  phoneNumber: string

  @Expose()
  @IsString()
  phoneNumberType: string

  @Expose()
  @IsBoolean()
  noPhone: boolean

  @Expose()
  @IsOptional()
  @IsBoolean()
  sameAddress?: boolean | null

  @Expose()
  @IsOptional()
  @IsString()
  relationship?: string | null

  @Expose()
  @IsOptional()
  @IsBoolean()
  workInRegion?: boolean | null

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  workAddress?: Address | null
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
  @IsString()
  incomeVouchers: string

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
