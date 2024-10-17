import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { ReservedCommunityType } from '../dtos/reserved-community-types/reserved-community-type.dto';
import { ReservedCommunityTypeCreate } from '../dtos/reserved-community-types/reserved-community-type-create.dto';
import { ReservedCommunityTypeUpdate } from '../dtos/reserved-community-types/reserved-community-type-update.dto';
import { ReservedCommunityTypeService } from '../services/reserved-community-type.service';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { ReservedCommunityTypeQueryParams } from '../dtos/reserved-community-types/reserved-community-type-query-params.dto';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('reservedCommunityTypes')
@ApiTags('reservedCommunityTypes')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@ApiExtraModels(ReservedCommunityTypeQueryParams)
@PermissionTypeDecorator('reservedCommunityType')
@UseGuards(ApiKeyGuard, JwtAuthGuard, PermissionGuard)
export class ReservedCommunityTypeController {
  constructor(
    private readonly ReservedCommunityTypeService: ReservedCommunityTypeService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List reservedCommunityTypes', operationId: 'list' })
  @ApiOkResponse({ type: ReservedCommunityType, isArray: true })
  async list(
    @Query() queryParams: ReservedCommunityTypeQueryParams,
  ): Promise<ReservedCommunityType[]> {
    return await this.ReservedCommunityTypeService.list(queryParams);
  }

  @Get(`:reservedCommunityTypeId`)
  @ApiOperation({
    summary: 'Get reservedCommunityType by id',
    operationId: 'retrieve',
  })
  @ApiOkResponse({ type: ReservedCommunityType })
  async retrieve(
    @Param('reservedCommunityTypeId') reservedCommunityTypeId: string,
  ): Promise<ReservedCommunityType> {
    return this.ReservedCommunityTypeService.findOne(reservedCommunityTypeId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create reservedCommunityType',
    operationId: 'create',
  })
  @ApiOkResponse({ type: ReservedCommunityType })
  async create(
    @Body() reservedCommunityType: ReservedCommunityTypeCreate,
  ): Promise<ReservedCommunityType> {
    return await this.ReservedCommunityTypeService.create(
      reservedCommunityType,
    );
  }

  @Put(`:reservedCommunityTypeId`)
  @ApiOperation({
    summary: 'Update reservedCommunityType',
    operationId: 'update',
  })
  @ApiOkResponse({ type: ReservedCommunityType })
  async update(
    @Body() reservedCommunityType: ReservedCommunityTypeUpdate,
  ): Promise<ReservedCommunityType> {
    return await this.ReservedCommunityTypeService.update(
      reservedCommunityType,
    );
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete reservedCommunityType by id',
    operationId: 'delete',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async delete(@Body() dto: IdDTO): Promise<SuccessDTO> {
    return await this.ReservedCommunityTypeService.delete(dto.id);
  }
}
