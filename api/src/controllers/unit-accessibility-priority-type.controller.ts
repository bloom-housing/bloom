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
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UnitAccessibilityPriorityTypeService } from '../services/unit-accessibility-priority-type.service';
import { UnitAccessibilityPriorityType } from '../dtos/unit-accessibility-priority-types/unit-accessibility-priority-type.dto';
import { UnitAccessibilityPriorityTypeCreate } from '../dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-create.dto';
import { UnitAccessibilityPriorityTypeUpdate } from '../dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-update.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { ThrottleGuard } from '../guards/throttler.guard';

@Controller('unitAccessibilityPriorityTypes')
@ApiTags('unitAccessibilityPriorityTypes')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@ApiExtraModels(IdDTO)
@PermissionTypeDecorator('unitAccessibilityPriorityType')
@UseGuards(ThrottleGuard, JwtAuthGuard, PermissionGuard)
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
  async list(): Promise<UnitAccessibilityPriorityType[]> {
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
  ): Promise<UnitAccessibilityPriorityType> {
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
  ): Promise<UnitAccessibilityPriorityType> {
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
    @Body() unitAccessibilityPriorityType: UnitAccessibilityPriorityTypeUpdate,
  ): Promise<UnitAccessibilityPriorityType> {
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
  async delete(@Body() dto: IdDTO): Promise<SuccessDTO> {
    return await this.unitAccessibilityPriorityTypeService.delete(dto.id);
  }
}
