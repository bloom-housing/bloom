import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger"
import { Expose } from "class-transformer"
import { IsOptional, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../shared/validations-groups.enum"
import { PaginationQueryParams } from "../shared/dto/pagination.dto"
import { ApplicationFlaggedSetService } from "./application-flagged-set.service"
import {
  Controller,
  Get,
  Param,
  Put,
  Query,
  Request,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { Request as ExpressRequest } from "express"
import { mapTo } from "../shared/mapTo"
import {
  ApplicationFlaggedSetDto,
  ApplicationFlaggedSetUpdateDto,
  PaginatedApplicationFlaggedSetDto,
} from "./dto/application-flagged-set.dto"

export class ApplicationFlaggedSetListQueryParams extends PaginationQueryParams {
  @Expose()
  @ApiProperty({
    type: String,
    example: "listingId",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  listingId?: string
}

@Controller("applicationFlaggedSets")
@ApiTags("applicationFlaggedSets")
@ApiBearerAuth()
@UsePipes(
  new ValidationPipe({
    ...defaultValidationPipeOptions,
    groups: [ValidationsGroupsEnum.default],
  })
)
export class ApplicationFlaggedSetController {
  constructor(private readonly applicationFlaggedSetsService: ApplicationFlaggedSetService) {}

  @Get()
  @ApiOperation({ summary: "List application flagged sets", operationId: "list" })
  async list(
    @Request() req: ExpressRequest,
    @Query() queryParams: ApplicationFlaggedSetListQueryParams
  ): Promise<PaginatedApplicationFlaggedSetDto> {
    const response = await this.applicationFlaggedSetsService.list(queryParams)
    return mapTo(PaginatedApplicationFlaggedSetDto, response)
  }

  @Get(`:afsId`)
  @ApiOperation({ summary: "Get application by id", operationId: "unresolvedList" })
  async unresolvedList(
    @Request() req: ExpressRequest,
    @Param("afsId") afsId: string
  ): Promise<ApplicationFlaggedSetDto> {
    const app = await this.applicationFlaggedSetsService.unresolvedList(afsId)
    return mapTo(ApplicationFlaggedSetDto, app)
  }

  // @Put(`:afsID, :applicationIds`)
  // @ApiOperation({ summary: "Resolve AFS", operationId: "resolveAfs" })
  // async resolveAfs(
  //   @Request() req: ExpressRequest,
  //   @Param("afsId") afsId: string,
  //   @Param("applicationIds") applicationIds: [],
  // ): Promise<ApplicationFlaggedSetUpdateDto> {
  //   const app = await this.applicationFlaggedSetsService.getResolvedApplications(afsId, applicationIds, user)
  //   return mapTo(ApplicationFlaggedSetUpdateDto, app)
  // }
}
