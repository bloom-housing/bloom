import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Applicant } from "./applicant.entity"
import { Expose, Type } from "class-transformer"
import { IsBoolean, IsDefined, IsNumber, IsObject, IsString, ValidateNested } from "class-validator"
import { Address } from "../../shared/entities/address.entity"
import { AlternateContact } from "./alternate-contact.entity"
import { Accessibility } from "./accessibility.entity"
import { Demographics } from "./demographics.entity"
import { HouseholdMember } from "./household-member.entity"

@Entity()
export class ApplicationData extends AbstractEntity {
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
