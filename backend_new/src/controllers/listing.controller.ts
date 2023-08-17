import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ListingService } from '../services/listing.service';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { ListingsQueryParams } from '../dtos/listings/listings-query-params.dto';
import { LanguagesEnum } from '@prisma/client';
import { ListingsRetrieveParams } from '../dtos/listings/listings-retrieve-params.dto';
import { PaginationAllowsAllQueryParams } from '../dtos/shared/pagination.dto';
import { ListingFilterParams } from '../dtos/listings/listings-filter-params.dto';
import { PaginatedListingDto } from '../dtos/listings/paginated-listing.dto';
import Listing from '../dtos/listings/listing.dto';
import { IdDTO } from '../dtos/shared/id.dto';
import { ListingCreateValidationPipe } from '../validation-pipes/listing-create-pipes';
import { ListingCreate } from '../dtos/listings/listing-create.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { ListingUpdate } from '../dtos/listings/listing-update.dto';
import { ListingUpdateValidationPipe } from '../validation-pipes/listing-update-pipe';

@Controller('listings')
@ApiTags('listings')
@ApiExtraModels(
  ListingsQueryParams,
  ListingFilterParams,
  ListingsRetrieveParams,
  PaginationAllowsAllQueryParams,
  IdDTO,
)
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Get()
  @ApiOperation({
    summary: 'Get a paginated set of listings',
    operationId: 'list',
  })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: PaginatedListingDto })
  public async getPaginatedSet(@Query() queryParams: ListingsQueryParams) {
    return await this.listingService.list(queryParams);
  }

  @Get(`:id`)
  @ApiOperation({ summary: 'Get listing by id', operationId: 'retrieve' })
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  @ApiOkResponse({ type: Listing })
  async retrieve(
    @Headers('language') language: LanguagesEnum,
    @Param('id', new ParseUUIDPipe({ version: '4' })) listingId: string,
    @Query() queryParams: ListingsRetrieveParams,
  ) {
    return await this.listingService.findOne(
      listingId,
      language,
      queryParams.view,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create listing', operationId: 'create' })
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ListingCreateValidationPipe(defaultValidationPipeOptions))
  @ApiOkResponse({ type: Listing })
  async create(@Body() listingDto: ListingCreate): Promise<Listing> {
    return await this.listingService.create(listingDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete listing by id', operationId: 'delete' })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  async delete(@Body() dto: IdDTO): Promise<SuccessDTO> {
    return await this.listingService.delete(dto.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update listing by id', operationId: 'update' })
  @UsePipes(new ListingUpdateValidationPipe(defaultValidationPipeOptions))
  async update(
    @Param('id') listingId: string,
    @Body() dto: ListingUpdate,
  ): Promise<Listing> {
    return await this.listingService.update(dto);
  }

  @Get(`byMultiselectQuestion/:multiselectQuestionId`)
  @ApiOperation({
    summary: 'Get listings by multiselect question id',
    operationId: 'retrieveListings',
  })
  @ApiOkResponse({ type: IdDTO, isArray: true })
  async retrieveListings(
    @Param('multiselectQuestionId') multiselectQuestionId: string,
  ) {
    return await this.listingService.findListingsWithMultiSelectQuestion(
      multiselectQuestionId,
    );
  }
}
