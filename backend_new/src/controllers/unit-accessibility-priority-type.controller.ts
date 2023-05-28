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
import { UnitAccessibilityPriorityTypeService } from '../services/unit-accessibility-priority-type.service';
import { UnitAccessibilityPriorityType } from '../dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-get.dto';
import { UnitAccessibilityPriorityTypeCreate } from '../dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-create';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';

@Controller('unitAccessibilityPriorityTypes')
@ApiTags('unitAccessibilityPriorityTypes')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@ApiExtraModels(UnitAccessibilityPriorityTypeCreate, IdDTO)
export class UnitAccessibilityPriorityTypeController {
  constructor(
    private readonly unitAccessibilityPriorityTypeService: UnitAccessibilityPriorityTypeService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List unitAccessibilityPriorityTypes',
    operationId: 'list',
  })
  @ApiOkResponse({ type: UnitAccessibilityPriorityType, isArray: true })
  async list() {
    return await this.unitAccessibilityPriorityTypeService.list();
  }

  @Get(`:unitAccessibilityPriorityTypeId`)
  @ApiOperation({
    summary: 'Get unitAccessibilityPriorityType by id',
    operationId: 'retrieve',
  })
  @ApiOkResponse({ type: UnitAccessibilityPriorityType })
  async retrieve(
    @Param('unitAccessibilityPriorityTypeId')
    unitAccessibilityPriorityTypeId: string,
  ) {
    return this.unitAccessibilityPriorityTypeService.findOne(
      unitAccessibilityPriorityTypeId,
    );
  }

  @Post()
  @ApiOperation({
    summary: 'Create unitAccessibilityPriorityType',
    operationId: 'create',
  })
  @ApiOkResponse({ type: UnitAccessibilityPriorityType })
  async create(
    @Body() unitAccessibilityPriorityType: UnitAccessibilityPriorityTypeCreate,
  ) {
    return await this.unitAccessibilityPriorityTypeService.create(
      unitAccessibilityPriorityType,
    );
  }

  @Put(`:unitAccessibilityPriorityTypeId`)
  @ApiOperation({
    summary: 'Update unitAccessibilityPriorityType',
    operationId: 'update',
  })
  @ApiOkResponse({ type: UnitAccessibilityPriorityType })
  async update(
    @Body() unitAccessibilityPriorityType: UnitAccessibilityPriorityType,
  ) {
    return await this.unitAccessibilityPriorityTypeService.update(
      unitAccessibilityPriorityType,
    );
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete unitAccessibilityPriorityType by id',
    operationId: 'delete',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async delete(@Body() dto: IdDTO) {
    return await this.unitAccessibilityPriorityTypeService.delete(dto.id);
  }
}
