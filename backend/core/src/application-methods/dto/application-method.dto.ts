import { Expose, Type } from "class-transformer"
import { IsDate, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { OmitType } from "@nestjs/swagger"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApplicationMethod } from "../entities/application-method.entity"
import { PaperApplicationDto } from "../../paper-applications/dto/paper-application.dto"
import { IdDto } from "../../shared/dto/id.dto"

export class ApplicationMethodDto extends OmitType(ApplicationMethod, [
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
  @Type(() => IdDto)
  paperApplications?: IdDto[] | null
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
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt?: Date

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt?: Date

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  paperApplications?: IdDto[] | null
}
