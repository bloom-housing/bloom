import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne, BaseEntity
} from "typeorm"
import { User } from "./user.entity"
import { Listing } from "./listing.entity"
import { IsJSON, IsString, IsUUID } from "class-validator"

@Entity({ name: "applications" })
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @IsString()
  @IsUUID()
  id: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne((type) => User, (user) => user.applications)
  user: User

  @Column()
  @IsString()
  userId: string

  @ManyToOne((type) => Listing, (listing) => listing.applications)
  listing: Listing

  @Column()
  @IsString()
  listingId: string

  @Column({ type: "jsonb", nullable: true })
  @IsJSON()
  application: any
}
