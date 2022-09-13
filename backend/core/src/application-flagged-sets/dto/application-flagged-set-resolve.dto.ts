import { Expose, Type } from "class-transformer"
import { IsEnum, IsUUID, IsDefined, IsArray, ArrayMaxSize, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApplicationResolve } from "../types/application-resolve"
import { FlaggedSetStatus } from "../types/flagged-set-status-enum"

export class ApplicationFlaggedSetResolveDto {
  @Expose()
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  afsId: string

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(512, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationResolve)
  applications: ApplicationResolve[]

  @Expose()
  @IsEnum(FlaggedSetStatus, { groups: [ValidationsGroupsEnum.default] })
  reviewStatus: FlaggedSetStatus
}
