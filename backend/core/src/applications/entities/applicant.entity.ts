import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Expose, Type } from "class-transformer"
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Address } from "../../shared/entities/address.entity"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

@Entity()
export class Applicant extends AbstractEntity {
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

  @Column({ nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  emailAddress?: string

  @Column()
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  noEmail: boolean

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  phoneNumber: string

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  phoneNumberType: string

  @Column()
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  noPhone: boolean

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsIn(["yes", "no"], { groups: [ValidationsGroupsEnum.default] })
  workInRegion: string | null

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  workAddress: Address

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  address: Address
}
