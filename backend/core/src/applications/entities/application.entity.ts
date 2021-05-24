import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne, RelationId
} from "typeorm"
import { User } from "../../user/entities/user.entity"
import { Listing } from "../../listings/entities/listing.entity"
import { Expose, Type } from "class-transformer"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Applicant } from "./applicant.entity"
import { Address } from "../../shared/entities/address.entity"
import { AlternateContact } from "./alternate-contact.entity"
import { Accessibility } from "./accessibility.entity"
import { Demographics } from "./demographics.entity"
import { HouseholdMember } from "./household-member.entity"
import { ApplicationPreference } from "./application-preferences.entity"
import { Language } from "../../shared/types/language-enum"
import { ApplicationStatus } from "../types/application-status-enum"
import { ApplicationSubmissionType } from "../types/application-submission-type-enum"
import { IncomePeriod } from "../types/income-period-enum"

@Entity({ name: "applications" })
export class Application extends AbstractEntity {
  @DeleteDateColumn()
  @Expose()
  @Type(() => Date)
  deletedAt?: Date | null

  @Column({ type: "text", nullable: true })
  @Expose()
  appUrl?: string | null

  @ManyToOne(() => User, (user) => user.applications, { nullable: true })
  user: User | null

  @RelationId((application: Application) => application.user)
  @Expose()
  userId?: string

  @ManyToOne(() => Listing, (listing) => listing.applications)
  listing: Listing

  @RelationId((application: Application) => application.listing)
  @Expose()
  listingId?: string

  @OneToOne(() => Applicant, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @Type(() => Applicant)
  applicant: Applicant

  @Column({ type: "bool", nullable: true })
  @Expose()
  additionalPhone?: boolean | null

  @Column({ type: "text", nullable: true })
  @Expose()
  additionalPhoneNumber?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  additionalPhoneNumberType?: string | null

  @Column("text", { array: true })
  @Expose()
  contactPreferences: string[]

  @Column({ type: "integer", nullable: true })
  @Expose()
  householdSize?: number | null

  @Column({ type: "text", nullable: true })
  @Expose()
  housingStatus?: string | null

  @Column({ type: "bool", nullable: true })
  @Expose()
  sendMailToMailingAddress?: boolean | null

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @Type(() => Address)
  mailingAddress: Address

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @Type(() => Address)
  alternateAddress: Address

  @OneToOne(() => AlternateContact, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @Type(() => AlternateContact)
  alternateContact: AlternateContact

  @OneToOne(() => Accessibility, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @Type(() => Accessibility)
  accessibility: Accessibility

  @OneToOne(() => Demographics, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @Type(() => Demographics)
  demographics: Demographics

  @Column({ type: "bool", nullable: true })
  @Expose()
  incomeVouchers?: boolean | null

  @Column({ type: "text", nullable: true })
  @Expose()
  income?: string | null

  @Column({ enum: IncomePeriod, nullable: true })
  @Expose()
  incomePeriod?: IncomePeriod | null

  @OneToMany(() => HouseholdMember, (householdMember) => householdMember.application, {
    eager: true,
    cascade: true,
  })
  @Expose()
  @Type(() => HouseholdMember)
  householdMembers: HouseholdMember[]

  @Column({ type: "text", array: true })
  @Expose()
  preferredUnit: string[]

  @Column({ type: "jsonb" })
  @Expose()
  @Type(() => ApplicationPreference)
  preferences: ApplicationPreference[]

  @Column({ enum: ApplicationStatus })
  @Expose()
  status: ApplicationStatus

  @Column({ enum: Language, nullable: true })
  @Expose()
  language?: Language | null

  @Column({ enum: ApplicationSubmissionType })
  @Expose()
  submissionType: ApplicationSubmissionType

  @Column({ type: "bool", nullable: true })
  @Expose()
  acceptedTerms?: boolean | null

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @Type(() => Date)
  submissionDate?: Date | null

  @Column({ type: "bool", default: false })
  @Expose()
  markedAsDuplicate: boolean
}
