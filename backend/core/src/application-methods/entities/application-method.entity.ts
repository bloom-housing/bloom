import { Column, Entity, ManyToOne, OneToMany } from "typeorm"
import { Expose, Type } from "class-transformer"
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { ApiProperty } from "@nestjs/swagger"
import { Listing } from "../../listings/entities/listing.entity"
import { ApplicationMethodType } from "../types/application-method-type-enum"
import { PaperApplication } from "../../paper-applications/entities/paper-application.entity"

@Entity({ name: "application_methods" })
export class ApplicationMethod extends AbstractEntity {
  @Column({ type: "enum", enum: ApplicationMethodType })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ApplicationMethodType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: ApplicationMethodType, enumName: "ApplicationMethodType" })
  type: ApplicationMethodType

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  label?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  @ValidateIf((o) => o.type === ApplicationMethodType.ExternalLink, {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsUrl({ require_protocol: true }, { groups: [ValidationsGroupsEnum.default] })
  externalReference?: string | null

  @Column({ type: "bool", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  acceptsPostmarkedApplications?: boolean | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  phoneNumber?: string | null

  @OneToMany(() => PaperApplication, (paperApplication) => paperApplication.applicationMethod, {
    cascade: true,
    eager: true,
  })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PaperApplication)
  paperApplications?: PaperApplication[] | null

  @ManyToOne(() => Listing, (listing) => listing.applicationMethods)
  listing: Listing
}
