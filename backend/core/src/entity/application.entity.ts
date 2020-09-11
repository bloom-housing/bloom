import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm"
import { User } from "./user.entity"
import { Listing } from "./listing.entity"
import { IsDateString, IsDefined, IsJSON, IsString, IsUUID } from "class-validator"
import { Expose } from "class-transformer"

@Entity({ name: "applications" })
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString()
  @IsUUID()
  id: string

  @CreateDateColumn()
  @Expose()
  @IsDateString()
  createdAt: string

  @UpdateDateColumn()
  @Expose()
  @IsDateString()
  updatedAt: string

  @Column({ type: "text", nullable: false })
  @Expose()
  @IsString()
  appUrl: string

  @ManyToOne((type) => User, (user) => user.applications, { nullable: true })
  user: User | null

  @ManyToOne((type) => Listing, (listing) => listing.applications)
  listing: Listing

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsDefined()
  application: any
}
