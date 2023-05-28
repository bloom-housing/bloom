import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UnitTypeService } from '../services/unit-type.service';
import { UnitType } from '../dtos/unit-types/unit-type-get.dto';
import { UnitTypeCreate } from '../dtos/unit-types/unit-type-create.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';

@Controller('unitTypes')
@ApiTags('unitTypes')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@ApiExtraModels(UnitTypeCreate, IdDTO)
export class UnitTypeController {
  constructor(private readonly unitTypeService: UnitTypeService) {}

  @Get()
  @ApiOperation({ summary: 'List unitTypes', operationId: 'list' })
  @ApiOkResponse({ type: UnitType, isArray: true })
  async list() {
    return await this.unitTypeService.list();
  }

  @Get(`:unitTypeId`)
  @ApiOperation({
    summary: 'Get unitType by id',
    operationId: 'retrieve',
  })
  @ApiOkResponse({ type: UnitType })
  async retrieve(@Param('unitTypeId') unitTypeId: string) {
    return this.unitTypeService.findOne(unitTypeId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create unitType',
    operationId: 'create',
  })
  @ApiOkResponse({ type: UnitType })
  async create(@Body() unitType: UnitTypeCreate) {
    return await this.unitTypeService.create(unitType);
  }

  @Put(`:unitTypeId`)
  @ApiOperation({
    summary: 'Update unitType',
    operationId: 'update',
  })
  @ApiOkResponse({ type: UnitType })
  async update(@Body() unitType: UnitType) {
    return await this.unitTypeService.update(unitType);
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete unitType by id',
    operationId: 'delete',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async delete(@Body() dto: IdDTO) {
    return await this.unitTypeService.delete(dto.id);
  }
}
