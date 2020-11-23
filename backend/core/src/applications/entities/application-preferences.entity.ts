import { Expose } from "class-transformer"
import { IsBoolean } from "class-validator"
import { Column, Entity } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"

@Entity()
export class ApplicationPreferences extends AbstractEntity {
  @Column()
  @Expose()
  @IsBoolean()
  liveIn: boolean

  @Column()
  @Expose()
  @IsBoolean()
  none: boolean

  @Column()
  @Expose()
  @IsBoolean()
  workIn: boolean
}
