import { Expose } from "class-transformer"
import { IsBoolean } from "class-validator"
import { Column, Entity } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

@Entity()
export class ApplicationPreferences extends AbstractEntity {
  @Column()
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  liveIn: boolean

  @Column()
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  none: boolean

  @Column()
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  workIn: boolean
}
