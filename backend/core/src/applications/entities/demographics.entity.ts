import { Column, Entity } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Expose } from "class-transformer"
import { IsString } from "class-validator"

@Entity()
export class Demographics extends AbstractEntity {
  @Column()
  @Expose()
  @IsString()
  ethnicity: string

  @Column()
  @Expose()
  @IsString()
  gender: string

  @Column()
  @Expose()
  @IsString()
  sexualOrientation: string

  @Column({ array: true, type: 'text' })
  @Expose()
  @IsString({ each: true })
  howDidYouHear: string[]

  @Column()
  @Expose()
  @IsString()
  race: string
}
