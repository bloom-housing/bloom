import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Expose, Type } from "class-transformer"
import { IsDate, IsString, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../types/validations-groups-enum"

export class AbstractEntity {
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
}
