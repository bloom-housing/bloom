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
import { PaperApplicationService } from '../services/paper-application.service';
import { PaperApplication } from '../dtos/paper-applications/paper-application-get.dto';
import { PaperApplicationCreate } from '../dtos/paper-applications/paper-application-create.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { AssetCreate } from '../dtos/assets/asset-create.dto';
import { Asset } from '../dtos/assets/asset-get.dto';

@Controller('paperApplications')
@ApiTags('paperApplications')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@ApiExtraModels(PaperApplicationCreate, IdDTO, AssetCreate, Asset)
export class PaperApplicationController {
  constructor(
    private readonly paperApplicationService: PaperApplicationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List paperApplications', operationId: 'list' })
  @ApiOkResponse({ type: PaperApplication, isArray: true })
  async list() {
    return await this.paperApplicationService.list();
  }

  @Get(`:paperApplicationId`)
  @ApiOperation({
    summary: 'Get paperApplication by id',
    operationId: 'retrieve',
  })
  @ApiOkResponse({ type: PaperApplication })
  async retrieve(@Param('paperApplicationId') paperApplicationId: string) {
    return this.paperApplicationService.findOne(paperApplicationId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create paperApplication',
    operationId: 'create',
  })
  @ApiOkResponse({ type: PaperApplication })
  async create(@Body() paperApplication: PaperApplicationCreate) {
    return await this.paperApplicationService.create(paperApplication);
  }

  @Put(`:paperApplicationId`)
  @ApiOperation({
    summary: 'Update paperApplication',
    operationId: 'update',
  })
  @ApiOkResponse({ type: PaperApplication })
  async update(@Body() paperApplication: PaperApplicationCreate) {
    return await this.paperApplicationService.update(paperApplication);
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete paperApplication by id',
    operationId: 'delete',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async delete(@Body() dto: IdDTO) {
    return await this.paperApplicationService.delete(dto.id);
  }
}
