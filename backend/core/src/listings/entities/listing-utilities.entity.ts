import { Expose, Type } from "class-transformer"
import { IsBoolean, IsOptional, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Column, Entity, OneToOne } from "typeorm"
import { Listing } from "./listing.entity"

@Entity({ name: "listing_utilities" })
export class ListingUtilities extends AbstractEntity {
  @OneToOne(() => Listing, (listing) => listing.utilities)
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Listing)
  listing: Listing

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  water?: boolean | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  gas?: boolean | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  trash?: boolean | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  sewer?: boolean | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  electricity?: boolean | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  cable?: boolean | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  phone?: boolean | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  internet?: boolean | null
}
