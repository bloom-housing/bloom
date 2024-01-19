import { Expose } from "class-transformer"
import { IsString, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class MapLayerDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  name: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  jurisdictionId: string
}
