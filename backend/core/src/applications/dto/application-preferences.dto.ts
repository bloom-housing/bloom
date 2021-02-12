import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsDate, IsDefined, IsOptional, IsUUID, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"
// import { ApplicationPreference } from "../entities/application-preferences.entity"
import { IdDto } from "../../lib/id.dto"

// TODO
// export class ApplicationPreferencesDto extends OmitType(ApplicationPreference, [
//   "application",
//   "preference",
// ] as const) {
//   @Expose()
//   @IsDefined({ groups: [ValidationsGroupsEnum.default] })
//   @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
//   @Type(() => IdDto)
//   preference: IdDto
// }
//
// export class ApplicationPreferencesCreateDto extends OmitType(ApplicationPreferencesDto, [
//   "id",
//   "createdAt",
//   "updatedAt",
// ] as const) {}
//
// export class ApplicationPreferencesUpdateDto extends OmitType(ApplicationPreferencesDto, [
//   "id",
//   "createdAt",
//   "updatedAt",
// ] as const) {
//   @Expose()
//   @IsOptional({ groups: [ValidationsGroupsEnum.default] })
//   @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
//   id?: string
//
//   @Expose()
//   @IsOptional({ groups: [ValidationsGroupsEnum.default] })
//   @IsDate({ groups: [ValidationsGroupsEnum.default] })
//   @Type(() => Date)
//   createdAt?: Date
//
//   @Expose()
//   @IsOptional({ groups: [ValidationsGroupsEnum.default] })
//   @IsDate({ groups: [ValidationsGroupsEnum.default] })
//   @Type(() => Date)
//   updatedAt?: Date
// }
