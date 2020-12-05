import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, IsString, ValidateNested } from "class-validator"
import { Address } from "../../shared/entities/address.entity"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

@Entity()
export class AlternateContact extends AbstractEntity {
  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  type: string

  @Column({ nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  otherType: string | null

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  firstName: string

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  lastName: string

  @Column({ nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  agency: string | null

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  phoneNumber: string

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  emailAddress: string

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  mailingAddress: Address
}
