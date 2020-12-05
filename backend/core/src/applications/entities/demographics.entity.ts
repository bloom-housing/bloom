import { Column, Entity } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Expose } from "class-transformer"
import { IsOptional, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

@Entity()
export class Demographics extends AbstractEntity {
  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  ethnicity: string

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  gender: string

  @Column()
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  sexualOrientation: string

  @Column({ array: true, type: "text" })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  howDidYouHear: string[]

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  race?: string | null
}
