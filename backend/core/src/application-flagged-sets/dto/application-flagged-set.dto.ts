import { OmitType } from "@nestjs/swagger"
import { ApplicationFlaggedSet } from "../entities/application-flagged-set.entity"
import { Expose, Transform, Type } from "class-transformer"
import {
  ArrayMaxSize,
  IsArray,
  IsDate,
  IsDefined,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested
} from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"
import { UserDto } from "../../user/dto/user.dto"
import { ApplicationCreateDto, ApplicationDto } from "../../applications/dto/application.dto"
import { PaginationFactory } from "../../shared/dto/pagination.dto"
import { IdDto } from "../../shared/dto/id.dto"
import { HouseholdMemberUpdateDto } from "../../applications/dto/household-member.dto"

export class ApplicationFlaggedSetDto extends OmitType(ApplicationFlaggedSet, [
  "resolvingUserId",
  "applications",
  "resolvedApplications",
] as const) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UserDto)
  resolvingUserId: UserDto

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicationDto)
  applications: ApplicationDto[]

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicationDto)
  resolvedApplications: ApplicationDto[]
}

export class PaginatedApplicationFlaggedSetDto extends PaginationFactory<ApplicationFlaggedSetDto>(
  ApplicationFlaggedSetDto
) {}

export class ApplicationFlaggedSetCreateDto extends OmitType(ApplicationFlaggedSetDto, [
  "resolvingUserId",
  "applications",
  "resolvedApplications",
] as const) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UserDto)
  resolvingUserId: UserDto

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicationCreateDto)
  applications: ApplicationCreateDto[]

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicationCreateDto)
  resolvedApplications: ApplicationCreateDto[]
}

export class ApplicationFlaggedSetUpdateDto extends OmitType(ApplicationFlaggedSetDto, [
  "id",
  "createdAt",
  "updatedAt",
  "resolvingUserId",
  "applications",
  "resolvedApplications",
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
  @Type(() => ApplicationFlaggedSetUpdateDto)
  applications: ApplicationFlaggedSetUpdateDto[]

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicationFlaggedSetUpdateDto)
  resolvedApplications: ApplicationFlaggedSetUpdateDto[]
}

export class ApplicationFlaggedSetResolveDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  afsId: string

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(512, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  applicationIds: IdDto[]
}
