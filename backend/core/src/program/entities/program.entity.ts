import { Column, Entity, ManyToMany, OneToMany } from "typeorm"
import { Expose, Type } from "class-transformer"
import { IsOptional, IsString, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Jurisdiction } from "../../jurisdictions/entities/jurisdiction.entity"
import { ListingProgram } from "./listing-program.entity"
import { FormMetadata } from "../../applications/types/form-metadata/form-metadata"

@Entity({ name: "programs" })
class Program extends AbstractEntity {
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

  @OneToMany(() => ListingProgram, (listingProgram) => listingProgram.program)
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingProgram)
  listingPrograms: ListingProgram[]

  @ManyToMany(() => Jurisdiction, (jurisdiction) => jurisdiction.programs)
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Jurisdiction)
  jurisdictions: Jurisdiction[]

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => FormMetadata)
  formMetadata?: FormMetadata
}

export { Program as default, Program }
