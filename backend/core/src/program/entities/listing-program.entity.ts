import { Column, Entity, ManyToOne } from "typeorm"
import { Program } from "./program.entity"
import { Expose, Type } from "class-transformer"
import { IsNumber, IsOptional } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Listing } from "../../listings/entities/listing.entity"

@Entity({ name: "listing_programs" })
export class ListingProgram {
  @ManyToOne(() => Listing, (listing) => listing.listingPrograms, {
    primary: true,
    orphanedRowAction: "delete",
  })
  @Type(() => Listing)
  listing: Listing

  @ManyToOne(() => Program, (program) => program.listingPrograms, {
    primary: true,
    eager: true,
  })
  @Expose()
  @Type(() => Program)
  program: Program

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  ordinal?: number | null
}
