import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Listing } from "./listing.entity"
import { Expose } from "class-transformer"
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from "class-validator"

export enum ApplicationMethodType {
  Internal = "Internal",
  FileDownload = "FileDownload",
  ExternalLink = "ExternalLink",
  PaperPickup = "PaperPickup",
  POBox = "POBox",
  LeasingAgent = "LeasingAgent",
}

@Entity({ name: "application_methods" })
export class ApplicationMethod extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString()
  @IsUUID()
  id: string

  @CreateDateColumn()
  @Expose()
  @IsString()
  @IsDateString()
  createdAt: string

  @UpdateDateColumn()
  @Expose()
  @IsString()
  @IsDateString()
  updatedAt: string

  @Column({
    type: "enum",
    enum: ApplicationMethodType,
  })
  @Expose()
  @IsString()
  @IsEnum(ApplicationMethodType)
  type: ApplicationMethodType

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  label: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  externalReference: string | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional()
  @IsBoolean()
  acceptsPostmarkedApplications: boolean | null
  @ManyToOne((type) => Listing, (listing) => listing.applicationMethods)
  listing: Listing
}
