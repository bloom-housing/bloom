import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { Expose, Type } from "class-transformer"
import { IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { User } from "../../auth/entities/user.entity"

@Entity({ name: "activity_logs" })
export class ActivityLog extends AbstractEntity {
  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  module: string

  @Column("uuid")
  @Expose()
  recordId: string

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  action: string

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => User)
  user: User
}
