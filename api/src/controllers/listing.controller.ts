import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Request,
  Res,
  StreamableFile,
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
import { Request as ExpressRequest, Response } from 'express';
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
import { PermissionAction } from '../decorators/permission-action.decorator';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { AdminOrJurisdictionalAdminGuard } from '../guards/admin-or-jurisdiction-admin.guard';
import { ListingCsvExporterService } from '../services/listing-csv-export.service';
import { ListingCsvQueryParams } from '../dtos/listings/listing-csv-query-params.dto';
import { PermissionGuard } from '../guards/permission.guard';
import { ExportLogInterceptor } from '../interceptors/export-log.interceptor';
import { ThrottleGuard } from '../guards/throttler.guard';

@Controller('listings')
@ApiTags('listings')
@ApiExtraModels(
  ListingsQueryParams,
  ListingFilterParams,
  ListingsRetrieveParams,
  PaginationAllowsAllQueryParams,
  IdDTO,
)
@UseGuards(ThrottleGuard, OptionalAuthGuard)
@PermissionTypeDecorator('listing')
@ActivityLogMetadata([{ targetPropertyName: 'status', propertyPath: 'status' }])
@UseInterceptors(ActivityLogInterceptor)
export class ListingController {
  constructor(
    private readonly listingService: ListingService,
    private readonly listingCsvExportService: ListingCsvExporterService,
  ) {}

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

  // REMOVE_WHEN_EXTERNAL_NOT_NEEDED
  @Get('combined')
  // @ApiExtraModels(CombinedListingFilterParams, CombinedListingsQueryParams)
  @ApiOperation({
    summary: 'List all local and external listings',
    operationId: 'listCombined',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  public async getCombined(
    @Query() queryParams: ListingsQueryParams,
  ): Promise<PaginatedListingDto> {
    mapTo(ListingsQueryParams, queryParams, {
      excludeExtraneousValues: true,
    });
    const list = await this.listingService.listCombined(queryParams);
    return mapTo(PaginatedListingDto, list);
  }

  @Get(`csv`)
  @ApiOperation({
    summary: 'Get listings and units as zip',
    operationId: 'listAsCsv',
  })
  @Header('Content-Type', 'application/zip')
  @UseGuards(OptionalAuthGuard, PermissionGuard)
  @UseInterceptors(ExportLogInterceptor)
  async listAsCsv(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
    @Query(new ValidationPipe(defaultValidationPipeOptions))
    queryParams: ListingCsvQueryParams,
  ): Promise<StreamableFile> {
    return await this.listingCsvExportService.exportFile(req, res, queryParams);
  }

  @Get(`external/:id`)
  @ApiOperation({
    summary: 'Get listing for external consumption by id',
    operationId: 'externalRetrieve',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  @ApiOkResponse({ type: String })
  async retrieveForExternalConsumption(
    @Headers('language') language: LanguagesEnum,
    @Param('id', new ParseUUIDPipe({ version: '4' })) listingId: string,
    @Query() queryParams: ListingsRetrieveParams,
  ) {
    return await this.listingService.findOneAndExternalize(
      listingId,
      language,
      queryParams.view,
    );
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
    return await this.listingService.delete(dto.id, mapTo(User, req['user']));
  }

  @Put('process')
  @ApiOperation({
    summary: 'Trigger the listing process job',
    operationId: 'process',
  })
  @ApiOkResponse({ type: SuccessDTO })
  @PermissionAction(permissionActions.submit)
  @UseInterceptors(ActivityLogInterceptor)
  @UseGuards(OptionalAuthGuard, AdminOrJurisdictionalAdminGuard)
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
