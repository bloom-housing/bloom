import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Expose, Type } from "class-transformer"
import { IsBoolean, IsDefined, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { Address } from "../../shared/entities/address.entity"
import { ApplicationData } from "./application-data.entity"

@Entity()
export class HouseholdMember extends AbstractEntity {
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

  @ManyToOne(() => ApplicationData, (applicationData) => applicationData.householdMembers)
  applicationData: ApplicationData
}
