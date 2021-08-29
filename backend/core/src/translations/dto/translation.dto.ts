import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsDate, IsOptional, IsUUID } from "class-validator"
import { IdDto } from "../../shared/dto/id.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Translation } from "../entities/translation.entity"

export class TranslationDto extends OmitType(Translation, [] as const) {}

export class TranslationCreateDto extends OmitType(TranslationDto, [
  "id",
  "createdAt",
  "updatedAt",
  "jurisdiction",
] as const) {
  @Expose()
  @Type(() => IdDto)
  jurisdiction: IdDto
}

export class TranslationUpdateDto extends OmitType(TranslationDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id?: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt?: Date

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt?: Date
}
