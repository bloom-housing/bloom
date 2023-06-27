import {
  Controller,
  Get,
  Param,
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
import { ApplicationService } from '../services/application.service';
import { Application } from '../dtos/applications/application.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { IdDTO } from '../dtos/shared/id.dto';
import { PaginatedApplicationDto } from '../dtos/applications/paginated-application.dto';
import { ApplicationQueryParams } from '../dtos/applications/application-query-params.dto';

@Controller('applications')
@ApiTags('applications')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@ApiExtraModels(IdDTO)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get()
  @ApiOperation({
    summary: 'Get a paginated set of listings',
    operationId: 'list',
  })
  @ApiOkResponse({ type: PaginatedApplicationDto })
  async list(@Query() queryParams: ApplicationQueryParams) {
    return await this.applicationService.list(queryParams);
  }

  @Get(`:applicationId`)
  @ApiOperation({
    summary: 'Get application by id',
    operationId: 'retrieve',
  })
  @ApiOkResponse({ type: Application })
  async retrieve(@Param('applicationId') applicationId: string) {
    return this.applicationService.findOne(applicationId);
  }
}
