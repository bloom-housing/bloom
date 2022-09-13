import { Expose, Type } from "class-transformer"
import { IsEnum } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApplicationReviewStatus } from "../../applications/types/application-review-status-enum"
import { IdDto } from "src/shared/dto/id.dto"

export class ApplicationResolve {
  @Expose()
  @Type(() => IdDto)
  application: IdDto

  @Expose()
  @IsEnum(ApplicationReviewStatus, { groups: [ValidationsGroupsEnum.default] })
  reviewStatus: ApplicationReviewStatus
}
