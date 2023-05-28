import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReservedCommunityTypeService } from '../services/reserved-community-type.service';
import { ReservedCommunityType } from '../dtos/reserved-community-types/reserved-community-type-get.dto';
import { ReservedCommunitTypeCreate } from '../dtos/reserved-community-types/reserved-community-type-create.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { ReservedCommunityTypeQueryParams } from '../dtos/reserved-community-types/reserved-community-type-query-params.dto';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';

@Controller('reservedCommunityTypes')
@ApiTags('reservedCommunityTypes')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@ApiExtraModels(
  ReservedCommunitTypeCreate,
  IdDTO,
  ReservedCommunityTypeQueryParams,
)
export class ReservedCommunityTypeController {
  constructor(
    private readonly ReservedCommunityTypeService: ReservedCommunityTypeService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List reservedCommunityTypes', operationId: 'list' })
  @ApiOkResponse({ type: ReservedCommunityType, isArray: true })
  async list(@Query() queryParams: ReservedCommunityTypeQueryParams) {
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
  ) {
    return this.ReservedCommunityTypeService.findOne(reservedCommunityTypeId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create reservedCommunityType',
    operationId: 'create',
  })
  @ApiOkResponse({ type: ReservedCommunityType })
  async create(@Body() reservedCommunityType: ReservedCommunitTypeCreate) {
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
  async update(@Body() reservedCommunityType: ReservedCommunityType) {
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
  async delete(@Body() dto: IdDTO) {
    return await this.ReservedCommunityTypeService.delete(dto.id);
  }
}
