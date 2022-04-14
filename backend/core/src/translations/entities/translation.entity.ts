import { Column, Entity, Index, ManyToOne } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Expose } from "class-transformer"
import { IsEnum, IsJSON } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApiProperty } from "@nestjs/swagger"
import { Language } from "../../shared/types/language-enum"
import { TranslationsType } from "../types/translations-type"
import { Jurisdiction } from "../../jurisdictions/entities/jurisdiction.entity"

@Entity({ name: "translations" })
@Index(["jurisdiction", "language"], { unique: true })
export class Translation extends AbstractEntity {
  @ManyToOne(() => Jurisdiction, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
    eager: true,
  })
  jurisdiction: Jurisdiction

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
