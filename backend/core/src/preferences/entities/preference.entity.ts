import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Expose, Type } from "class-transformer"
import { IsDate, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { FormMetadata } from "../../applications/types/form-metadata/form-metadata"
import { PreferenceLink } from "../types/preference-link"
import { ApiProperty } from "@nestjs/swagger"
import { ListingPreference } from "./listing-preference.entity"

@Entity({ name: "preferences" })
class Preference {
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

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  title?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  subtitle?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  description?: string | null

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PreferenceLink)
  @ApiProperty({ type: [PreferenceLink] })
  links?: PreferenceLink[] | null

  @OneToMany(() => ListingPreference, (listingPreference) => listingPreference.preference)
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingPreference)
  listingPreferences: ListingPreference[]

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => FormMetadata)
  formMetadata?: FormMetadata
}

export { Preference as default, Preference }
