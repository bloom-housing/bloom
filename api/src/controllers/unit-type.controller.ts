import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UnitTypeService } from '../services/unit-type.service';
import { UnitType } from '../dtos/unit-types/unit-type.dto';
import { UnitTypeCreate } from '../dtos/unit-types/unit-type-create.dto';
import { UnitTypeUpdate } from '../dtos/unit-types/unit-type-update.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('unitTypes')
@ApiTags('unitTypes')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@PermissionTypeDecorator('unitType')
@UseGuards(ApiKeyGuard, JwtAuthGuard, PermissionGuard)
export class UnitTypeController {
  constructor(private readonly unitTypeService: UnitTypeService) {}

  @Get()
  @ApiOperation({ summary: 'List unitTypes', operationId: 'list' })
  @ApiOkResponse({ type: UnitType, isArray: true })
  async list(): Promise<UnitType[]> {
    return await this.unitTypeService.list();
  }

  @Get(`:unitTypeId`)
  @ApiOperation({
    summary: 'Get unitType by id',
    operationId: 'retrieve',
  })
  @ApiOkResponse({ type: UnitType })
  async retrieve(@Param('unitTypeId') unitTypeId: string): Promise<UnitType> {
    return this.unitTypeService.findOne(unitTypeId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create unitType',
    operationId: 'create',
  })
  @ApiOkResponse({ type: UnitType })
  async create(@Body() unitType: UnitTypeCreate): Promise<UnitType> {
    return await this.unitTypeService.create(unitType);
  }

  @Put(`:unitTypeId`)
  @ApiOperation({
    summary: 'Update unitType',
    operationId: 'update',
  })
  @ApiOkResponse({ type: UnitType })
  async update(@Body() unitType: UnitTypeUpdate): Promise<UnitType> {
    return await this.unitTypeService.update(unitType);
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete unitType by id',
    operationId: 'delete',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async delete(@Body() dto: IdDTO): Promise<SuccessDTO> {
    return await this.unitTypeService.delete(dto.id);
  }
}
