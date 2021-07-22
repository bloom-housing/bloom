import { Column, Entity } from "typeorm"
import { Expose } from "class-transformer"
import { IsString, MaxLength } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { AbstractEntity } from "../../shared/entities/abstract.entity"

@Entity({ name: "unit_rent_types" })
export class UnitRentType extends AbstractEntity {
  @Column({ type: "text" })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  name: string
}
