import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm"
import { Listing } from "./listing.entity"
import { Expose, Type } from "class-transformer"
import { IsDate, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"

export class PreferenceLink {
  @Expose()
  @IsString()
  title: string
  @Expose()
  @IsString()
  url: string
}

@Entity({ name: "preferences" })
class Preference {
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

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional()
  @IsNumber()
  ordinal: number | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  title: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  subtitle: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  description: string | null

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PreferenceLink)
  links: PreferenceLink[] | null

  @ManyToOne(() => Listing, (listing) => listing.preferences, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  listing: Listing
}

export { Preference as default, Preference }
