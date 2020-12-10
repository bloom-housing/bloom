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

@Entity()
export class HouseholdMember extends AbstractEntity {
  @Column({ nullable: true })
  @Expose()
  @IsOptional()
  @IsNumber()
  orderId?: number

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
  @IsString()
  birthMonth: string

  @Column()
  @Expose()
  @IsString()
  birthDay: string

  @Column()
  @Expose()
  @IsString()
  birthYear: string

  @Column()
  @Expose()
  @IsString()
  emailAddress: string

  @Column({ nullable: true, type: "boolean" })
  @Expose()
  @IsOptional()
  @IsBoolean()
  noEmail: boolean | null

  @Column()
  @Expose()
  @IsString()
  phoneNumber: string

  @Column()
  @Expose()
  @IsString()
  phoneNumberType: string

  @Column({ nullable: true, type: "boolean" })
  @Expose()
  @IsOptional()
  @IsBoolean()
  noPhone: boolean | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional()
  @IsIn(["yes", "no"])
  sameAddress?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  relationship?: string | null

  @Column({ type: "boolean", nullable: true })
  @IsOptional()
  @IsIn(["yes", "no"])
  workInRegion?: string | null

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  workAddress?: Address | null

  @ManyToOne(() => Application, (application) => application.householdMembers)
  application: Application
}
