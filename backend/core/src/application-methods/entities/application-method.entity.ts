import { Column, Entity, ManyToOne } from "typeorm"
import { Expose, Type } from "class-transformer"
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { ApiProperty } from "@nestjs/swagger"
import { Listing } from "../../listings/entities/listing.entity"
import { Asset } from "../../assets/entities/asset.entity"
import { ApplicationMethodType } from "../types/application-method-type-enum"

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
  externalReference?: string | null

  @Column({ type: "bool", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  acceptsPostmarkedApplications?: boolean | null

  @ManyToOne(() => Asset, { eager: true, nullable: true, cascade: true })
  @Expose()
  @Type(() => Asset)
  file?: Asset | null

  @ManyToOne(() => Listing, (listing) => listing.applicationMethods)
  listing: Listing
}
