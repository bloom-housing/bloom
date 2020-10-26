import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm"
import { User } from "./user.entity"
import { Listing } from "./listing.entity"
import { IsDateString, IsDefined, IsJSON, IsString, IsUUID } from "class-validator"
import { Expose } from "class-transformer"
import { Address } from "../shared/dto/address.dto"

export class Applicant {
  firstName: string
  middleName: string
  lastName: string
  birthMonth: number
  birthDay: number
  birthYear: number
  emailAddress: string
  noEmail: boolean
  phoneNumber: string
  phoneNumberType: string
  noPhone: boolean
  // TODO Type? Was null
  workInRegion: boolean
}

export class AlternateContact {
  type: string
  otherType: string
  firstName: string
  lastName: string
  agency: string
  phoneNumber: string
  emailAddress: string
  mailingAddress: Address
}

export class Accessibility {
  mobility: boolean
  vision: boolean
  hearing: boolean
}

export class Demographics {
  ethnicity: string
  gender: string
  sexualOrientation: string
  howDidYouHear: string
  race: string
}

export class ApplicationData {
  applicant: Applicant
  address: Address
  workAddress: Address
  additionalPhone: boolean
  additionalPhoneNumber: string
  additionalPhoneNumberType: string
  contactPreferences: Array<string>
  householdSize: number
  housingStatus: string
  sendMailToMailingAddress: boolean
  mailingAddress: Address
  alternateAddress: Address
  alternateContact: AlternateContact
  accessibility: Accessibility
  demographics: Demographics
  incomeVouchers: string
  income: string
  incomePeriod: string
  // TODO Type
  householdMembers: Array<string>
  // TODO Type
  preferredUnit: Array<string>
  // TODO Type
  preferences: Array<string>
}

@Entity({ name: "applications" })
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString()
  @IsUUID()
  id: string

  @CreateDateColumn()
  @Expose()
  @IsDateString()
  createdAt: string

  @UpdateDateColumn()
  @Expose()
  @IsDateString()
  updatedAt: string

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
  application: any
}
