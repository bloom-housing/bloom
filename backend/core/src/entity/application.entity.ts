import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
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

@Entity()
export class Applicant {
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

  @Column()
  @Expose()
  @IsString()
  firstName: string

  @Column()
  @Expose()
  @IsString()
  middleName: string

  @Column()
  @Expose()
  @IsString()
  lastName: string

  @Column()
  @Expose()
  @IsNumber()
  birthMonth: number

  @Column()
  @Expose()
  @IsNumber()
  birthDay: number

  @Column()
  @Expose()
  @IsNumber()
  birthYear: number

  @Column()
  @Expose()
  @IsString()
  emailAddress: string

  @Column()
  @Expose()
  @IsBoolean()
  noEmail: boolean

  @Column()
  @Expose()
  @IsString()
  phoneNumber: string

  @Column()
  @Expose()
  @IsString()
  phoneNumberType: string

  @Column()
  @Expose()
  @IsBoolean()
  noPhone: boolean

  @Column()
  @Expose()
  @IsOptional()
  @IsBoolean()
  workInRegion: boolean | null

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Address)
  workAddress: Address

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Address)
  address: Address
}

export class AlternateContact {
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

  @Column()
  @Expose()
  @IsString()
  type: string

  @Column()
  @Expose()
  @IsString()
  otherType: string

  @Column()
  @Expose()
  @IsString()
  firstName: string

  @Column()
  @Expose()
  @IsString()
  lastName: string

  @Column()
  @Expose()
  @IsString()
  agency: string

  @Column()
  @Expose()
  @IsString()
  phoneNumber: string

  @Column()
  @Expose()
  @IsString()
  emailAddress: string

  @OneToOne(() => Address, { eager: true, cascade: true })
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Address)
  mailingAddress: Address
}

export class Accessibility {
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

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional()
  @IsBoolean()
  mobility: boolean | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional()
  @IsBoolean()
  vision: boolean | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional()
  @IsBoolean()
  hearing: boolean | null
}

export class Demographics {
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

  @Column()
  @Expose()
  @IsString()
  ethnicity: string

  @Column()
  @Expose()
  @IsString()
  gender: string

  @Column()
  @Expose()
  @IsString()
  sexualOrientation: string

  @Column()
  @Expose()
  @IsString()
  howDidYouHear: string

  @Column()
  @Expose()
  @IsString()
  race: string
}

export class HouseholdMember {
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

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional()
  @IsNumber()
  // TODO Add on frontend
  orderId?: number | null

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Address)
  address: Address

  @Column()
  @Expose()
  @IsString()
  firstName: string

  @Column()
  @Expose()
  @IsString()
  middleName: string

  @Column()
  @Expose()
  @IsString()
  lastName: string

  @Column()
  @Expose()
  @IsNumber()
  birthMonth: number

  @Column()
  @Expose()
  @IsNumber()
  birthDay: number

  @Column()
  @Expose()
  @IsNumber()
  birthYear: number

  @Column()
  @Expose()
  @IsString()
  emailAddress: string

  @Column()
  @Expose()
  @IsBoolean()
  noEmail: boolean

  @Column()
  @Expose()
  @IsString()
  phoneNumber: string

  @Column()
  @Expose()
  @IsString()
  phoneNumberType: string

  @Column()
  @Expose()
  @IsBoolean()
  noPhone: boolean

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional()
  @IsBoolean()
  sameAddress?: boolean | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  relationship?: string | null

  @Column({ type: "boolean", nullable: true })
  @IsOptional()
  @IsBoolean()
  workInRegion?: boolean | null

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  workAddress?: Address | null
}

@Entity()
export class ApplicationData {
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
  @IsString()
  incomeVouchers: string

  @Column()
  @Expose()
  @IsString()
  income: string

  @Column()
  @Expose()
  @IsString()
  incomePeriod: string

  @OneToMany(() => HouseholdMember, (householdMember) => householdMember.applicationData, {
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

  // TODO Make preferences easy to work with SQL
  @Column({ type: "jsonb" })
  @Expose()
  @IsDefined()
  @IsObject()
  preferences: Record<string, any>
}

export class 

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

  @OneToOne(() => ApplicationData, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => ApplicationData)
  application: ApplicationData
}
