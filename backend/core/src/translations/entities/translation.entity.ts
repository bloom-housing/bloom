import { Column, Entity, Index } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Expose } from "class-transformer"
import { IsEnum, IsString, MaxLength } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"
import { ApiProperty } from "@nestjs/swagger"
import { CountyCode } from "../../shared/types/county-code"
import { Language } from "../../shared/types/language-enum"

@Entity()
@Index(["countyCode", "language", "key"], { unique: true })
export class Translation extends AbstractEntity {
  @Column({ enum: CountyCode })
  @Expose()
  @IsEnum(CountyCode, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: CountyCode, enumName: "CountyCode" })
  countyCode: CountyCode

  @Column({ enum: Language })
  @Expose()
  @IsEnum(Language, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: Language, enumName: "Language" })
  language: Language

  @Column({ type: "text" })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  key: string

  @Column({ type: "text" })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(8192, { groups: [ValidationsGroupsEnum.default] })
  text: string
}
