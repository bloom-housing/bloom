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

@Entity({ name: "applications" })
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @CreateDateColumn()
  createdAt: Date
  @UpdateDateColumn()
  updatedAt: Date
  @ManyToOne((type) => User, (user) => user.applications)
  user: User
  @Column()
  userId: string
  @ManyToOne((type) => Listing, (listing) => listing.applications)
  listing: Listing
  @Column()
  listingId: string
  @Column({ type: "jsonb", nullable: true })
  application: any
}
