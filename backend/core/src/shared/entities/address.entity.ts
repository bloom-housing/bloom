import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Expose } from "class-transformer"
import { IsDate, IsDefined, IsNumber, IsOptional, IsString, IsUUID } from "class-validator"

@Entity()
export class Address {
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

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  placeName?: string

  @Column()
  @Expose()
  @IsDefined()
  @IsString()
  city: string

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  county?: string

  @Column()
  @Expose()
  @IsDefined()
  @IsString()
  state: string

  @Column()
  @Expose()
  @IsDefined()
  @IsString()
  street: string

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  street2?: string

  @Column()
  @Expose()
  @IsDefined()
  @IsString()
  zipCode: string

  @Column({ type: "numeric", nullable: true })
  @Expose()
  @IsOptional()
  @IsNumber()
  latitude?: number

  @Column({ type: "numeric", nullable: true })
  @Expose()
  @IsOptional()
  @IsNumber()
  longitude?: number
}
