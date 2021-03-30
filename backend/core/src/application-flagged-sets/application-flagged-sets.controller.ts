import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger"
import { ResourceType } from "../auth/resource_type.decorator"
import { OptionalAuthGuard } from "../auth/optional-auth.guard"
import { AuthzGuard } from "../auth/authz.guard"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { mapTo } from "../shared/mapTo"
import { Expose } from "class-transformer"
import { IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../shared/validations-groups.enum"
import { ApplicationFlaggedSetsService } from "./application-flagged-sets.service"
import { PaginationQueryParams } from "../shared/dto/pagination.dto"
import { PaginatedApplicationFlaggedSetDto } from "./dto/application-flagged-set.dto"

export class ApplicationFlaggedSetsListQueryParams extends PaginationQueryParams {
  @Expose()
  @ApiProperty({
    type: String,
    example: "listingId",
    required: true,
  })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  listingId: string
}

@Controller("/applicationFlaggedSets")
@ApiTags("applicationFlaggedSets")
@ApiBearerAuth()
@ResourceType("applicationFlaggedSet")
@UseGuards(OptionalAuthGuard, AuthzGuard)
@UsePipes(
  new ValidationPipe({
    ...defaultValidationPipeOptions,
  })
)
export class ApplicationFlaggedSetsController {
  constructor(private readonly applicationFlaggedSetsService: ApplicationFlaggedSetsService) {}

  @Get()
  @ApiOperation({ summary: "List application flagged sets", operationId: "list" })
  async list(
    @Query() queryParams: ApplicationFlaggedSetsListQueryParams
  ): Promise<PaginatedApplicationFlaggedSetDto> {
    const response = await this.applicationFlaggedSetsService.listPaginated(queryParams)
    return mapTo(PaginatedApplicationFlaggedSetDto, response)
  }
}
