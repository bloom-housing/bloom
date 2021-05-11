import { Column, Entity, Index } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Expose } from "class-transformer"
import { IsEnum, IsJSON } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApiProperty } from "@nestjs/swagger"
import { CountyCode } from "../../shared/types/county-code"
import { Language } from "../../shared/types/language-enum"
import { TranslationsType } from "../types/translations-type"

@Entity({ name: "translations" })
@Index(["countyCode", "language"], { unique: true })
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

  @Column({ type: "jsonb" })
  @Expose()
  @IsJSON({ groups: [ValidationsGroupsEnum.default] })
  translations: TranslationsType
}
