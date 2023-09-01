import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  ClassSerializerInterceptor,
  Headers,
  ParseUUIDPipe,
  Header,
  Request,
} from "@nestjs/common"
import { ListingsService } from "./listings.service"
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger"
import { ListingDto } from "./dto/listing.dto"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { OptionalAuthGuard } from "../auth/guards/optional-auth.guard"
import { mapTo } from "../shared/mapTo"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { Language } from "../shared/types/language-enum"
import { PaginatedListingDto } from "./dto/paginated-listing.dto"
import { ListingCreateDto } from "./dto/listing-create.dto"
import { ListingUpdateDto } from "./dto/listing-update.dto"
import { ListingFilterParams } from "./dto/listing-filter-params"
import { ListingsQueryParams } from "./dto/listings-query-params"
import { ListingsRetrieveQueryParams } from "./dto/listings-retrieve-query-params"
import { ListingCreateValidationPipe } from "./validation-pipes/listing-create-validation-pipe"
import { ListingUpdateValidationPipe } from "./validation-pipes/listing-update-validation-pipe"
import { ActivityLogInterceptor } from "../activity-log/interceptors/activity-log.interceptor"
import { ActivityLogMetadata } from "../activity-log/decorators/activity-log-metadata.decorator"
import { ListingsApiExtraModels } from "./types/listings-api-extra-models"
import { IdDto } from "../shared/dto/id.dto"
import { CombinedListingsQueryParams } from "./combined/combined-listings-query-params"
import { CombinedListingFilterParams } from "./combined/combined-listing-filter-params"
import { AuthzGuard } from "../../src/auth/guards/authz.guard"
import { ListingsCsvExporterService } from "./listings-csv-exporter.service"
import { ListingsZipQueryParams } from "./dto/listings-zip-query-params"

@Controller("listings")
@ApiTags("listings")
@ApiBearerAuth()
@ResourceType("listing")
@ApiExtraModels(ListingFilterParams, ListingsApiExtraModels)
@UseGuards(OptionalAuthGuard)
@ActivityLogMetadata([{ targetPropertyName: "status", propertyPath: "status" }])
@UseInterceptors(ActivityLogInterceptor)
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly listingsCsvExporter: ListingsCsvExporterService
  ) {}

  // TODO: Limit requests to defined fields
  @Get()
  @ApiExtraModels(ListingFilterParams)
  @ApiOperation({ summary: "List listings", operationId: "list" })
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  public async getAll(@Query() queryParams: ListingsQueryParams): Promise<PaginatedListingDto> {
    return mapTo(PaginatedListingDto, await this.listingsService.list(queryParams))
  }

  // REMOVE_WHEN_EXTERNAL_NOT_NEEDED
  @Get("combined")
  @ApiExtraModels(CombinedListingFilterParams, CombinedListingsQueryParams)
  @ApiOperation({
    summary: "List all local and external listings",
    operationId: "listCombined",
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  public async getCombined(
    @Query() queryParams: CombinedListingsQueryParams
  ): Promise<PaginatedListingDto> {
    mapTo(CombinedListingsQueryParams, queryParams, { excludeExtraneousValues: true })
    return mapTo(PaginatedListingDto, await this.listingsService.listCombined(queryParams))
  }

  @Post()
  @ApiOperation({ summary: "Create listing", operationId: "create" })
  @UsePipes(new ListingCreateValidationPipe(defaultValidationPipeOptions))
  async create(@Body() listingDto: ListingCreateDto): Promise<ListingDto> {
    const listing = await this.listingsService.create(listingDto)
    return mapTo(ListingDto, listing)
  }

  @Get(`csv`)
  @UseGuards(OptionalAuthGuard, AuthzGuard)
  @ApiOperation({ summary: "Retrieve listings and units in csv", operationId: "listAsCsv" })
  @Header("Content-Type", "text/csv")
  async listAsCsv(
    @Query(new ValidationPipe(defaultValidationPipeOptions))
    queryParams: ListingsZipQueryParams
  ): Promise<{ listingCsv: string; unitCsv: string }> {
    const data = await this.listingsService.rawListWithFlagged()
    const listingCsv = this.listingsCsvExporter.exportListingsFromObject(
      data?.listingData,
      data?.userAccessData,
      queryParams.timeZone
    )
    const unitCsv = this.listingsCsvExporter.exportUnitsFromObject(data?.unitData)
    return { listingCsv, unitCsv }
  }

  @Get(`:id`)
  @ApiOperation({ summary: "Get listing by id", operationId: "retrieve" })
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  async retrieve(
    @Headers("language") language: Language,
    @Param("id", new ParseUUIDPipe({ version: "4" })) listingId: string,
    @Query() queryParams: ListingsRetrieveQueryParams
  ): Promise<ListingDto> {
    if (listingId === undefined || listingId === "undefined") {
      return mapTo(ListingDto, {})
    }
    return mapTo(
      ListingDto,
      await this.listingsService.findOne(listingId, language, queryParams.view)
    )
  }

  @Put(`:id`)
  @ApiOperation({ summary: "Update listing by id", operationId: "update" })
  @UsePipes(new ListingUpdateValidationPipe(defaultValidationPipeOptions))
  async update(
    @Request() req,
    @Param("id") listingId: string,
    @Body() listingUpdateDto: ListingUpdateDto
  ): Promise<ListingDto> {
    const listing = await this.listingsService.update(listingUpdateDto, req.user)
    return mapTo(ListingDto, listing)
  }

  @Put(`updateAndNotify/:id`)
  @ApiOperation({
    summary: "Update listing by id and notify relevant users",
    operationId: "updateAndNotify",
  })
  @UsePipes(new ListingUpdateValidationPipe(defaultValidationPipeOptions))
  async updateAndNotify(
    @Request() req,
    @Param("id") listingId: string,
    @Body() listingUpdateDto: ListingUpdateDto
  ): Promise<ListingDto> {
    const listing = await this.listingsService.updateAndNotify(listingUpdateDto, req.user)
    return mapTo(ListingDto, listing)
  }

  @Delete()
  @ApiOperation({ summary: "Delete listing by id", operationId: "delete" })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  async delete(@Body() dto: IdDto) {
    await this.listingsService.delete(dto.id)
  }
}
