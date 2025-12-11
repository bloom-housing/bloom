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
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { PagiantedPropertyDto } from '../dtos/properties/paginated-property.dto';
import { PropertyQueryParams } from '../dtos/properties/property-query-params.dto';
import { PropertyService } from '../services/property.service';
import PropertyCreate from '../dtos/properties/property-create.dto';
import { PropertyUpdate } from '../dtos/properties/property-update.dto';
import Property from '../dtos/properties/property.dto';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';

@Controller('properties')
@ApiTags('properties')
@PermissionTypeDecorator('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  @ApiOperation({
    summary: 'Get a paginated set of properties',
    operationId: 'list',
  })
  @ApiOkResponse({ type: PagiantedPropertyDto })
  public async getPaginatedSet(@Query() queryParams: PropertyQueryParams) {
    return await this.propertyService.list(queryParams);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a proprty object by ID',
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
  @ApiOkResponse({ type: PagiantedPropertyDto })
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
  public async addProperty(@Body() propertyDto: PropertyCreate) {
    return await this.propertyService.create(propertyDto);
  }

  @Put()
  @ApiOperation({
    summary: 'Update an exiting property entry by id',
    operationId: 'update',
  })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  @ApiOkResponse({ type: Property })
  public async updateProperty(@Body() propertyDto: PropertyUpdate) {
    return await this.propertyService.update(propertyDto);
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete an property entry by ID',
    operationId: 'deleteById',
  })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  @ApiOkResponse({ type: SuccessDTO })
  public async deleteById(@Body() idDto: IdDTO) {
    return await this.propertyService.deleteOne(idDto.id);
  }
}
