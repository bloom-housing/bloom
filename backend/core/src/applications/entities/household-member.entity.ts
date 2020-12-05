import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Expose, Type } from "class-transformer"
import {
  IsBoolean,
  IsDefined,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Address } from "../../shared/entities/address.entity"
import { Application } from "./application.entity"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

@Entity()
export class HouseholdMember extends AbstractEntity {
  @Column({ nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  orderId?: number

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  address: Address

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  firstName: string

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  middleName: string

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  lastName: string

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  birthMonth: string

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  birthDay: string

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  birthYear: string

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  emailAddress: string

  @Column({ nullable: true, type: "boolean" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  noEmail: boolean | null

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  phoneNumber: string

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  phoneNumberType: string

  @Column({ nullable: true, type: "boolean" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  noPhone: boolean | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsIn(["yes", "no"], { groups: [ValidationsGroupsEnum.default] })
  sameAddress?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  relationship?: string | null

  @Column({ type: "boolean", nullable: true })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsIn(["yes", "no"], { groups: [ValidationsGroupsEnum.default] })
  workInRegion?: string | null

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  workAddress?: Address | null

  @ManyToOne(() => Application, (application) => application.householdMembers)
  application: Application
}
