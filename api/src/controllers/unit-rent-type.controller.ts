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
import { UnitRentTypeService } from '../services/unit-rent-type.service';
import { UnitRentType } from '../dtos/unit-rent-types/unit-rent-type.dto';
import { UnitRentTypeCreate } from '../dtos/unit-rent-types/unit-rent-type-create.dto';
import { UnitRentTypeUpdate } from '../dtos/unit-rent-types/unit-rent-type-update.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { ThrottleGuard } from '../guards/throttler.guard';

@Controller('unitRentTypes')
@ApiTags('unitRentTypes')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@ApiExtraModels(UnitRentTypeCreate, UnitRentTypeUpdate, IdDTO)
@PermissionTypeDecorator('unitRentType')
@UseGuards(ThrottleGuard, JwtAuthGuard, PermissionGuard)
export class UnitRentTypeController {
  constructor(private readonly unitRentTypeService: UnitRentTypeService) {}

  @Get()
  @ApiOperation({ summary: 'List unitRentTypes', operationId: 'list' })
  @ApiOkResponse({ type: UnitRentType, isArray: true })
  async list(): Promise<UnitRentType[]> {
    return await this.unitRentTypeService.list();
  }

  @Get(`:unitRentTypeId`)
  @ApiOperation({
    summary: 'Get unitRentType by id',
    operationId: 'retrieve',
  })
  @ApiOkResponse({ type: UnitRentType })
  async retrieve(
    @Param('unitRentTypeId') unitRentTypeId: string,
  ): Promise<UnitRentType> {
    return this.unitRentTypeService.findOne(unitRentTypeId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create unitRentType',
    operationId: 'create',
  })
  @ApiOkResponse({ type: UnitRentType })
  async create(
    @Body() unitRentType: UnitRentTypeCreate,
  ): Promise<UnitRentType> {
    return await this.unitRentTypeService.create(unitRentType);
  }

  @Put(`:unitRentTypeId`)
  @ApiOperation({
    summary: 'Update unitRentType',
    operationId: 'update',
  })
  @ApiOkResponse({ type: UnitRentType })
  async update(
    @Body() unitRentType: UnitRentTypeUpdate,
  ): Promise<UnitRentType> {
    return await this.unitRentTypeService.update(unitRentType);
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete unitRentType by id',
    operationId: 'delete',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async delete(@Body() dto: IdDTO): Promise<SuccessDTO> {
    return await this.unitRentTypeService.delete(dto.id);
  }
}
