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
  Request,
  UseGuards,
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
import { Request as ExpressRequest } from 'express';
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
import { ListingCreate } from '../dtos/listings/listing-create.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { ListingUpdate } from '../dtos/listings/listing-update.dto';
import { ListingCreateUpdateValidationPipe } from '../validation-pipes/listing-create-update-pipe';
import { mapTo } from '../utilities/mapTo';
import { User } from '../dtos/users/user.dto';
import { OptionalAuthGuard } from '../guards/optional.guard';
import { ActivityLogInterceptor } from '../interceptors/activity-log.interceptor';
import { ActivityLogMetadata } from '../decorators/activity-log-metadata.decorator';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
// TODO: when we add csv export endpoint need to add guard to it (https://github.com/bloom-housing/bloom/issues/3695)

@Controller('listings')
@ApiTags('listings')
@ApiExtraModels(
  ListingsQueryParams,
  ListingFilterParams,
  ListingsRetrieveParams,
  PaginationAllowsAllQueryParams,
  IdDTO,
)
@UseGuards(OptionalAuthGuard)
@PermissionTypeDecorator('listing')
@ActivityLogMetadata([{ targetPropertyName: 'status', propertyPath: 'status' }])
@UseInterceptors(ActivityLogInterceptor)
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
  @UsePipes(new ListingCreateUpdateValidationPipe(defaultValidationPipeOptions))
  @ApiOkResponse({ type: Listing })
  async create(
    @Request() req: ExpressRequest,
    @Body() listingDto: ListingCreate,
  ): Promise<Listing> {
    return await this.listingService.create(
      listingDto,
      mapTo(User, req['user']),
    );
  }

  @Delete()
  @ApiOperation({ summary: 'Delete listing by id', operationId: 'delete' })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  async delete(
    @Body() dto: IdDTO,
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return await this.listingService.delete(dto.id, mapTo(User, req.user));
  }

  @Put('process')
  @ApiOperation({
    summary: 'Trigger the listing process job',
    operationId: 'process',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async process(): Promise<SuccessDTO> {
    return await this.listingService.process();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update listing by id', operationId: 'update' })
  @UsePipes(new ListingCreateUpdateValidationPipe(defaultValidationPipeOptions))
  async update(
    @Request() req: ExpressRequest,
    @Param('id') listingId: string,
    @Body() dto: ListingUpdate,
  ): Promise<Listing> {
    return await this.listingService.update(dto, mapTo(User, req['user']));
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
