import { Column, Entity } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Expose } from "class-transformer"
import { IsString, MaxLength } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

@Entity({ name: "jurisdictions" })
export class Jurisdiction extends AbstractEntity {
  @Column({ type: "text" })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  name: string
}
