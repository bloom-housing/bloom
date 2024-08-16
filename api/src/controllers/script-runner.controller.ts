import {
  Body,
  Controller,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScriptRunnerService } from '../services/script-runner.service';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { OptionalAuthGuard } from '../guards/optional.guard';
import { AdminOrJurisdictionalAdminGuard } from '../guards/admin-or-jurisdiction-admin.guard';
import { DataTransferDTO } from '../dtos/script-runner/data-transfer.dto';
import { AmiChartImportDTO } from '../dtos/script-runner/ami-chart-import.dto';

@Controller('scriptRunner')
@ApiTags('scriptRunner')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@UseGuards(OptionalAuthGuard, AdminOrJurisdictionalAdminGuard)
export class ScirptRunnerController {
  constructor(private readonly scriptRunnerService: ScriptRunnerService) {}

  @Put('exampleScript')
  @ApiOperation({
    summary: 'An example of how the script runner can work',
    operationId: 'exampleScript',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async update(@Request() req: ExpressRequest): Promise<SuccessDTO> {
    return await this.scriptRunnerService.example(req);
  }

  @Put('transferJurisdictionData')
  @ApiOperation({
    summary: 'A script that pulls data from one source into the current db',
    operationId: 'transferJurisdictionData',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async transferJurisdictionData(
    @Body() dataTransferDTO: DataTransferDTO,
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return await this.scriptRunnerService.transferJurisdictionData(
      req,
      dataTransferDTO,
    );
  }

  @Put('transferJurisdictionListingsData')
  @ApiOperation({
    summary: 'A script that pulls data from one source into the current db',
    operationId: 'transferJurisdictionListingsData',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async transferJurisdictionListingsData(
    @Body() dataTransferDTO: DataTransferDTO,
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return await this.scriptRunnerService.transferJurisdictionListingData(
      req,
      dataTransferDTO,
    );
  }

  @Put('amiChartImport')
  @ApiOperation({
    summary:
      'A script that takes in a standardized string and outputs the input for the ami chart create endpoint',
    operationId: 'amiChartImport',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async amiChartImport(
    @Body() amiChartImportDTO: AmiChartImportDTO,
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return await this.scriptRunnerService.amiChartImport(
      req,
      amiChartImportDTO,
    );
  }

  @Put('lotteryTranslations')
  @ApiOperation({
    summary: 'A script that adds lottery translations to the db',
    operationId: 'lotteryTranslations',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async lotteryTranslations(
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return await this.scriptRunnerService.addLotteryTranslations(req);
  }
}
