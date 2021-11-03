import { Expose, Type } from "class-transformer"
import { ArrayMaxSize, IsArray, IsDefined, IsUUID, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { IdDto } from "../../shared/dto/id.dto"

export class ApplicationFlaggedSetResolveDto {
  @Expose()
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  afsId: string

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(512, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  applications: IdDto[]
}
