import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Listing } from "../../listings/entities/listing.entity"
import { Expose, Type } from "class-transformer"
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString, IsUUID } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

export enum ApplicationMethodType {
  Internal = "Internal",
  FileDownload = "FileDownload",
  ExternalLink = "ExternalLink",
  PaperPickup = "PaperPickup",
  POBox = "POBox",
  LeasingAgent = "LeasingAgent",
}

@Entity({ name: "application_methods" })
export class ApplicationMethod {
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

  @Column({
    type: "enum",
    enum: ApplicationMethodType,
  })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ApplicationMethodType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: ApplicationMethodType, enumName: "ApplicationMethodType" })
  type: ApplicationMethodType

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  label: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  externalReference: string | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  acceptsPostmarkedApplications: boolean | null
  @ManyToOne(() => Listing, (listing) => listing.applicationMethods)
  listing: Listing
}
