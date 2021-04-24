import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Expose, Type } from "class-transformer"
import { IsDate, IsString, IsUUID } from "class-validator"
import { Property } from "../../property/entities/property.entity"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

@Entity()
export class PropertyGroup {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id: string

  @CreateDateColumn()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt: Date

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  name: string

  @ManyToMany(() => Property)
  @JoinTable()
  properties: Property[]
}
