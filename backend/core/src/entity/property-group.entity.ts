import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Expose } from "class-transformer"
import { IsDate, IsString, IsUUID } from "class-validator"
import { Property } from "./property.entity"

@Entity()
export class PropertyGroup {
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

  @Column()
  @Expose()
  @IsString()
  name: string

  @ManyToMany(() => Property)
  @JoinTable()
  properties: Property[]
}
