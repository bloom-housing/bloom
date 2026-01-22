import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
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
import AgencyCreate from '../dtos/agency/agency-create.dto';
import { AgencyUpdate } from '../dtos/agency/agency-update.dto';
import Agency from '../dtos/agency/agency.dto';
import { IdDTO } from '../dtos/shared/id.dto';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { AgencyService } from '../services/agency.service';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { PaginatedAgencyDto } from '../dtos/agency/paginated-agency.dto';
import { AgencyQueryParams } from '../dtos/agency/agency-query-params.dto';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';

@Controller('agency')
@ApiTags('agency')
@ApiExtraModels(AgencyCreate, Agency, AgencyUpdate, IdDTO)
@PermissionTypeDecorator('agency')
@UseGuards(ApiKeyGuard, JwtAuthGuard, PermissionGuard)
export class AgencyController {
  constructor(private agencyService: AgencyService) {}

  @Get()
  @ApiOperation({
    summary: 'Get a paginated set of agencies',
    operationId: 'list',
  })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  @ApiOkResponse({ type: PaginatedAgencyDto })
  public async getPaginatedList(
    @Query() queryParams: AgencyQueryParams,
  ): Promise<PaginatedAgencyDto> {
    return await this.agencyService.list(queryParams);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single agency by its ID',
    operationId: 'getById',
  })
  @ApiOkResponse({ type: Agency })
  public async getById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) agencyId: string,
  ): Promise<Agency> {
    return await this.agencyService.findOne(agencyId);
  }

  @Post()
  @ApiOperation({
    summary: 'Creates a new agency entry in the database',
    operationId: 'create',
  })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  @ApiOkResponse({ type: Agency })
  public async createAgency(@Body() agencyDto: AgencyCreate): Promise<Agency> {
    return await this.agencyService.create(agencyDto);
  }

  @Put()
  @ApiOperation({
    summary: 'Updates an exiting agency entry in the database',
    operationId: 'update',
  })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  @ApiOkResponse({ type: Agency })
  public async update(@Body() agencyDto: AgencyUpdate): Promise<Agency> {
    return await this.agencyService.update(agencyDto);
  }

  @Delete()
  @ApiOperation({
    summary: 'Deletes an agency entry from the database by its ID',
    operationId: 'deletes',
  })
  @ApiOkResponse({ type: SuccessDTO })
  public async delete(@Body() idDto: IdDTO): Promise<SuccessDTO> {
    return await this.agencyService.deleteOne(idDto);
  }
}
