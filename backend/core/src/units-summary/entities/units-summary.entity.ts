import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import {
  IsBoolean, IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested
} from "class-validator"
import { Expose, Type } from "class-transformer"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitType } from "../../unit-types/entities/unit-type.entity"
import {
  UnitAccessibilityPriorityType
} from "../../unit-accessbility-priority-types/entities/unit-accessibility-priority-type.entity"
import { Listing } from "../../listings/entities/listing.entity"
import { UnitsSummaryAmiLevel } from "./units-summary-ami-level.entity"

@Entity({ name: "units_summary" })
export class UnitsSummary {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  id: string

  @ManyToMany(() => UnitType, { eager: true })
  @JoinTable()
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitType)
  unitType: UnitType[]

  @ManyToOne(() => Listing, (listing) => listing.unitsSummary, {})
  listing: Listing

  @OneToMany(() => UnitsSummaryAmiLevel, (unitsSummaryAmiLevel => unitsSummaryAmiLevel.unitsSummary),{ eager: true, cascade: true })
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitsSummaryAmiLevel)
  amiLevels: UnitsSummaryAmiLevel[]

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  maxOccupancy?: number | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  minOccupancy?: number | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  floorMin?: number | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  floorMax?: number | null

  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  sqFeetMin?: string | null

  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  sqFeetMax?: string | null

  @ManyToOne(() => UnitAccessibilityPriorityType, { eager: true, nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAccessibilityPriorityType)
  priorityType?: UnitAccessibilityPriorityType | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  totalCount?: number | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  totalAvailable?: number | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  bathroomMin?: number | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  bathroomMax?: number | null

  @Column({ type: "boolean", nullable: false, default: true })
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  openWaitlist: boolean
}
