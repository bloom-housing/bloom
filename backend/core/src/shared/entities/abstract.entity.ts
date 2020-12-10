import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Expose, Type } from "class-transformer"
import { IsDate, IsString, IsUUID } from "class-validator"

export class AbstractEntity {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString()
  @IsUUID()
  id: string

  @CreateDateColumn()
  @Expose()
  @IsDate()
  @Type(() => Date)
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate()
  @Type(() => Date)
  updatedAt: Date
}
