import { OmitType } from "@nestjs/swagger"
import { ApplicationFlaggedSet } from "../entities/application-flagged-set.entity"
import { Expose, Type } from "class-transformer"
import { IsDate, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"
import { UserDto } from "../../user/dto/user.dto"
import { ApplicantDto } from "../../applications/dto/applicant.dto"
import { ApplicationDto } from "../../applications/dto/application.dto"

export class ApplicationFlaggedSetDto extends OmitType(ApplicationFlaggedSet, [
  "resolvingUserId",
  "primaryApplicant",
  "applications",
] as const) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UserDto)
  resolvingUserId: UserDto

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicantDto)
  primaryApplicant: ApplicantDto

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicationDto)
  applications: ApplicationDto
}

export class ApplicationFlaggedSetCreateDto extends OmitType(ApplicationFlaggedSet, [
  "id",
  "createdAt",
  "updatedAt",
  "resolvingUserId",
  "primaryApplicant",
  "applications",
] as const) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UserDto)
  resolvingUserId: UserDto

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicantDto)
  primaryApplicant: ApplicantDto

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicationDto)
  applications: ApplicationDto
}

export class ApplicationFlaggedSetUpdateDto extends OmitType(ApplicationFlaggedSet, [
  "id",
  "createdAt",
  "updatedAt",
  "resolvingUserId",
  "primaryApplicant",
  "applications",
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
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UserDto)
  resolvingUserId: UserDto

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicantDto)
  primaryApplicant: ApplicantDto

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicationDto)
  applications: ApplicationDto
}
