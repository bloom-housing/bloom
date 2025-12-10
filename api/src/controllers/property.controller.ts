import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionTypeDecorator } from 'src/decorators/permission-type.decorator';
import { PagiantedPropertyDto } from 'src/dtos/properties/paginated-property.dto';
import { PropertyQueryParams } from 'src/dtos/properties/property-query-params.dto';
import { PropertyService } from 'src/services/property.service';
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
}
