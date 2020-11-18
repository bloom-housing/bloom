import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Expose, Type } from "class-transformer"
import { IsDefined, IsOptional, IsString, ValidateNested } from "class-validator"
import { Address } from "../../shared/entities/address.entity"

@Entity()
export class AlternateContact extends AbstractEntity {
  @Column()
  @Expose()
  @IsString()
  type: string

  @Column({ nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  otherType: string | null

  @Column()
  @Expose()
  @IsString()
  firstName: string

  @Column()
  @Expose()
  @IsString()
  lastName: string

  @Column({ nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  agency: string | null

  @Column()
  @Expose()
  @IsString()
  phoneNumber: string

  @Column()
  @Expose()
  @IsString()
  emailAddress: string

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Address)
  mailingAddress: Address
}
