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
import { Request as ExpressRequest } from 'express';
import type { Response } from 'express';
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
import { join } from 'path';
import { PermissionGuard } from '../guards/permission.guard';

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

  @Get(`csv`)
  @ApiOperation({
    summary: 'Get applications as csv',
    operationId: 'listAsCsv',
  })
  @Header('Content-Type', 'application/zip')
  @UseGuards(OptionalAuthGuard, PermissionGuard)
  async listAsCsv(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
    @Query(new ValidationPipe(defaultValidationPipeOptions))
    queryParams: ListingCsvQueryParams,
  ): Promise<StreamableFile> {
    const zipFileName = `listings-units-${new Date().getTime()}.zip`;
    const zipFilePath = join(process.cwd(), `src/temp/${zipFileName}`);
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename: ${zipFileName}`,
    });

    return await this.listingCsvExportService.exportFile(
      req,
      queryParams,
      zipFilePath,
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
