import { Column, Entity } from "typeorm"
import { Expose } from "class-transformer"
import { IsNumber, IsString, MaxLength } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { AbstractEntity } from "../../shared/entities/abstract.entity"

@Entity({ name: "unit_types" })
export class UnitType extends AbstractEntity {
  @Column({ type: "text" })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  name: string

  @Column({ type: "integer" })
  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  numBedrooms: number
}
