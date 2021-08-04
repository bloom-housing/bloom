import { Column, Entity, ManyToOne } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Language } from "../../shared/types/language-enum"
import { Expose, Type } from "class-transformer"
import { IsEnum, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApiProperty } from "@nestjs/swagger"
import { Asset } from "../../assets/entities/asset.entity"
import { ApplicationMethod } from "../../application-methods/entities/application-method.entity"

@Entity({ name: "paper_applications" })
export class PaperApplication extends AbstractEntity {
  @Column({ enum: Language })
  @Expose()
  @IsEnum(Language, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: Language, enumName: "Language" })
  language: Language

  @ManyToOne(() => Asset, { eager: true, cascade: true })
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  file: Asset

  @ManyToOne(() => ApplicationMethod, (am) => am.paperApplications)
  applicationMethod: ApplicationMethod
}
