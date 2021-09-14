import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator"
import { Expose, Type } from "class-transformer"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitType } from "../../unit-types/entities/unit-type.entity"
import { UnitAccessibilityPriorityType } from "../../unit-accessbility-priority-types/entities/unit-accessibility-priority-type.entity"
import { Listing } from "../../listings/entities/listing.entity"

@Entity({ name: "units_summary" })
class UnitsSummary {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  id: string

  @ManyToOne(() => UnitType, { eager: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitType)
  unitType: UnitType

  @ManyToOne(() => Listing, (listing) => listing.unitsSummary, {})
  listing: Listing

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  monthlyRentMin?: number | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  monthlyRentMax?: number | null

  @Column({ nullable: true, type: "numeric", precision: 8, scale: 2 })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  monthlyRentAsPercentOfIncome?: string | null

  @Column({ nullable: true, type: "integer" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  amiPercentage?: number | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  minimumIncomeMin?: string | null

  @Column({ nullable: true, type: "text" })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  minimumIncomeMax?: string | null

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
}

export { UnitsSummary as default, UnitsSummary }
