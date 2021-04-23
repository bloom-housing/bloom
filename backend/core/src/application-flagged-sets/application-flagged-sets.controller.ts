import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { Request as ExpressRequest } from "express"
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { OptionalAuthGuard } from "../auth/guards/optional-auth.guard"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { mapTo } from "../shared/mapTo"
import { Expose } from "class-transformer"
import { IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../shared/types/validations-groups-enum"
import { ApplicationFlaggedSetsService } from "./application-flagged-sets.service"
import { PaginationQueryParams } from "../shared/dto/pagination.dto"
import {
  ApplicationFlaggedSetDto,
  ApplicationFlaggedSetResolveDto,
  PaginatedApplicationFlaggedSetDto,
} from "./dto/application-flagged-set.dto"

export class PaginatedApplicationFlaggedSetQueryParams extends PaginationQueryParams {
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
    @Query() queryParams: PaginatedApplicationFlaggedSetQueryParams
  ): Promise<PaginatedApplicationFlaggedSetDto> {
    return mapTo(
      PaginatedApplicationFlaggedSetDto,
      await this.applicationFlaggedSetsService.listPaginated(queryParams)
    )
  }

  @Get(`:afsId`)
  @ApiOperation({ summary: "Retrieve application flagged set by id", operationId: "retrieve" })
  async retrieve(@Param("afsId") afsId: string): Promise<ApplicationFlaggedSetDto> {
    return mapTo(
      ApplicationFlaggedSetDto,
      await this.applicationFlaggedSetsService.findOneById(afsId)
    )
  }

  @Post("resolve")
  @ApiOperation({ summary: "Resolve application flagged set", operationId: "resolve" })
  async resolve(
    @Request() req: ExpressRequest,
    @Body() dto: ApplicationFlaggedSetResolveDto
  ): Promise<ApplicationFlaggedSetDto> {
    return mapTo(ApplicationFlaggedSetDto, await this.applicationFlaggedSetsService.resolve(dto))
  }
}
