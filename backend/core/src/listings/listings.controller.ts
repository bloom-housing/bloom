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
} from "@nestjs/common"
import { ListingsService } from "./listings.service"
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger"
import { ListingDto } from "./dto/listing.dto"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { OptionalAuthGuard } from "../auth/guards/optional-auth.guard"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { mapTo } from "../shared/mapTo"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { Language } from "../shared/types/language-enum"
import { PaginatedListingDto } from "./dto/paginated-listing.dto"
import { ListingCreateDto } from "./dto/listing-create.dto"
import { ListingUpdateDto } from "./dto/listing-update.dto"
import { ListingFilterParams } from "./dto/listing-filter-params"
import { ListingsQueryParams } from "./dto/listings-query-params"
import { ListingsRetrieveQueryParams } from "./dto/listings-retrieve-query-params"
import { ListingMetadataDto } from "./dto/listings-metadata.dto"
import { ListingCreateValidationPipe } from "./validation-pipes/listing-create-validation-pipe"
import { ListingUpdateValidationPipe } from "./validation-pipes/listing-update-validation-pipe"
import { ActivityLogInterceptor } from "../activity-log/interceptors/activity-log.interceptor"
import { ActivityLogMetadata } from "../activity-log/decorators/activity-log-metadata.decorator"

@Controller("listings")
@ApiTags("listings")
@ApiBearerAuth()
@ResourceType("listing")
@UseGuards(OptionalAuthGuard, AuthzGuard)
@ActivityLogMetadata([{ targetPropertyName: "status", propertyPath: "status" }])
@UseInterceptors(ActivityLogInterceptor)
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get("meta")
  @ApiOperation({ summary: "Returns Listing Metadata", operationId: "metadata" })
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  public async getListingMetaData(): Promise<ListingMetadataDto> {
    return mapTo(ListingMetadataDto, await this.listingsService.getMetadata())
  }

  // TODO: Limit requests to defined fields
  @Get()
  @ApiExtraModels(ListingFilterParams)
  @ApiOperation({ summary: "List listings", operationId: "list" })
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  public async getAll(@Query() queryParams: ListingsQueryParams): Promise<PaginatedListingDto> {
    return mapTo(PaginatedListingDto, await this.listingsService.list(queryParams))
  }

  @Post()
  @ApiOperation({ summary: "Create listing", operationId: "create" })
  @UsePipes(new ListingCreateValidationPipe(defaultValidationPipeOptions))
  async create(@Body() listingDto: ListingCreateDto): Promise<ListingDto> {
    const listing = await this.listingsService.create(listingDto)
    return mapTo(ListingDto, listing)
  }

  @Get(`:id`)
  @ApiOperation({ summary: "Get listing by id", operationId: "retrieve" })
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  async retrieve(
    @Headers("language") language: Language,
    @Param("id") listingId: string,
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
    @Param("id") listingId: string,
    @Body() listingUpdateDto: ListingUpdateDto
  ): Promise<ListingDto> {
    const listing = await this.listingsService.update(listingUpdateDto)
    return mapTo(ListingDto, listing)
  }

  @Delete(`:id`)
  @ApiOperation({ summary: "Delete listing by id", operationId: "delete" })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  async delete(@Param("id") listingId: string) {
    await this.listingsService.delete(listingId)
  }
}
