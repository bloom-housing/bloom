import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Expose, Type } from "class-transformer"
import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Address } from "../../shared/entities/address.entity"

@Entity()
export class Applicant extends AbstractEntity {
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
