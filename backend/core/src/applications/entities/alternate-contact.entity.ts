import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Expose, Type } from "class-transformer"
import {
  IsDefined,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  IsEmail,
} from "class-validator"
import { Address } from "../../shared/entities/address.entity"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { EnforceLowerCase } from "../../shared/decorators/enforceLowerCase.decorator"

@Entity()
export class AlternateContact extends AbstractEntity {
  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  type?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  otherType?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  firstName?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  lastName?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  agency?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.partners] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  phoneNumber?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  emailAddress?: string | null

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  mailingAddress: Address
}
