import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Expose } from "class-transformer"
import { IsString, MaxLength } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Column, Entity } from "typeorm"

@Entity({ name: "assets" })
export class Asset extends AbstractEntity {
  @Column({ type: "text" })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  fileId: string

  @Column({ type: "text" })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  label: string
}
