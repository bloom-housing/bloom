import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Expose } from "class-transformer"
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
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate()
  updatedAt: Date
}
