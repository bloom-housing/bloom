import { Expose, Type } from "class-transformer"
import { IsDate, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { OmitType } from "@nestjs/swagger"
import { IdDto } from "../../shared/dto/id.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApplicationMethod } from "../entities/application-method.entity"
import {
  PaperApplicationCreateDto,
  PaperApplicationDto,
  PaperApplicationUpdateDto,
} from "../../paper-applications/dto/paper-application.dto"

export class ApplicationMethodDto extends OmitType(ApplicationMethod, [
  "listing",
  "paperApplications",
  "listing",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PaperApplicationDto)
  paperApplications?: PaperApplicationDto[] | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  listing: IdDto
}

export class ApplicationMethodCreateDto extends OmitType(ApplicationMethodDto, [
  "id",
  "createdAt",
  "updatedAt",
  "paperApplications",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PaperApplicationCreateDto)
  paperApplications?: PaperApplicationCreateDto[] | null
}

export class ApplicationMethodUpdateDto extends OmitType(ApplicationMethodDto, [
  "id",
  "createdAt",
  "updatedAt",
  "paperApplications",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id?: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PaperApplicationUpdateDto)
  paperApplications?: PaperApplicationUpdateDto[] | null
}
