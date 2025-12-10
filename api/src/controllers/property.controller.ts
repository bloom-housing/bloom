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
import { PermissionTypeDecorator } from 'src/decorators/permission-type.decorator';
import { PagiantedPropertyDto } from 'src/dtos/properties/paginated-property.dto';
import { PropertyQueryParams } from 'src/dtos/properties/property-query-params.dto';
import { PropertyService } from 'src/services/property.service';
import PropertyCreate from 'src/dtos/properties/property-create.dto';
import { PropertyUpdate } from 'src/dtos/properties/property-update.dto';
import Property from 'src/dtos/properties/property.dto';
import { IdDTO } from 'src/dtos/shared/id.dto';
import { SuccessDTO } from 'src/dtos/shared/success.dto';
import { defaultValidationPipeOptions } from 'src/utilities/default-validation-pipe-options';

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
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: Property })
  public async addProperty(@Body() propertyDto: PropertyCreate) {
    return await this.propertyService.create(propertyDto);
  }

  @Put()
  @ApiOperation({
    summary: 'Update an exiting property entry by id',
    operationId: 'update',
  })
  @UsePipes(ValidationPipe)
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
