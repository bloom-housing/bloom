import { Column, Entity, OneToOne } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Expose, Type } from "class-transformer"
import { IsDefined, IsString, ValidateNested } from "class-validator"
import { Address } from "../../shared/entities/address.entity"

@Entity()
export class AlternateContact extends AbstractEntity {
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
