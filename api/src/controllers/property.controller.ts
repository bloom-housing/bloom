import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  ParseUUIDPipe,
  Put,
  UsePipes,
  ValidationPipe,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { PaginatedPropertyDto } from '../dtos/properties/paginated-property.dto';
import { PropertyQueryParams } from '../dtos/properties/property-query-params.dto';
import { PropertyService } from '../services/property.service';
import PropertyCreate from '../dtos/properties/property-create.dto';
import { PropertyUpdate } from '../dtos/properties/property-update.dto';
import Property from '../dtos/properties/property.dto';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { OptionalAuthGuard } from '../guards/optional.guard';
import { mapTo } from '../utilities/mapTo';
import { User } from '../dtos/users/user.dto';
import { PaginationMeta } from '../dtos/shared/pagination.dto';
import { PropertyFilterParams } from '../dtos/properties/property-filter-params.dto';

@Controller('properties')
@ApiTags('properties')
@UseGuards(OptionalAuthGuard)
@ApiExtraModels(
  PropertyCreate,
  PropertyUpdate,
  PropertyQueryParams,
  PropertyFilterParams,
  PaginationMeta,
  IdDTO,
)
@PermissionTypeDecorator('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  @ApiOperation({
    summary: 'Get a paginated set of properties',
    operationId: 'list',
  })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  @ApiOkResponse({ type: PaginatedPropertyDto })
  public async getPaginatedSet(@Query() queryParams: PropertyQueryParams) {
    return await this.propertyService.list(queryParams);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a property object by ID',
    operationId: 'getById',
  })
  public async getPropertyById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) propertyId: string,
  ) {
    return this.propertyService.findOne(propertyId);
  }

  @Post('list')
  @ApiOperation({
    summary: 'Get a paginated filtered set of properties',
    operationId: 'filterableList',
  })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  @ApiOkResponse({ type: PaginatedPropertyDto })
  public async getFiltrablePaginatedSet(
    @Body() queryParams: PropertyQueryParams,
  ) {
    return await this.propertyService.list(queryParams);
  }

  @Post()
  @ApiOperation({
    summary: 'Add a new property entry',
    operationId: 'add',
  })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  @ApiOkResponse({ type: Property })
  public async addProperty(
    @Request() req: ExpressRequest,
    @Body() propertyDto: PropertyCreate,
  ) {
    return await this.propertyService.create(
      propertyDto,
      mapTo(User, req['user']),
    );
  }

  @Put()
  @ApiOperation({
    summary: 'Update an exiting property entry by id',
    operationId: 'update',
  })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  @ApiOkResponse({ type: Property })
  public async updateProperty(
    @Request() req: ExpressRequest,
    @Body() propertyDto: PropertyUpdate,
  ) {
    return await this.propertyService.update(
      propertyDto,
      mapTo(User, req['user']),
    );
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete an property entry by ID',
    operationId: 'deleteById',
  })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  @ApiOkResponse({ type: SuccessDTO })
  public async deleteById(
    @Request() req: ExpressRequest,
    @Body() idDto: IdDTO,
  ) {
    return await this.propertyService.deleteOne(
      idDto.id,
      mapTo(User, req['user']),
    );
  }
}
