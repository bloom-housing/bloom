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
import { BulkApplicationResendDTO } from '../dtos/script-runner/bulk-application-resend.dto';

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

  @Put('dataTransfer')
  @ApiOperation({
    summary: 'A script that pulls data from one source into the current db',
    operationId: 'dataTransfer',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async dataTransfer(
    @Body() dataTransferDTO: DataTransferDTO,
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return await this.scriptRunnerService.dataTransfer(req, dataTransferDTO);
  }

  @Put('bulkApplicationResend')
  @ApiOperation({
    summary:
      'A script that resends application confirmations to applicants of a listing',
    operationId: 'bulkApplicationResend',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async bulkApplicationResend(
    @Body() bulkApplicationResendDTO: BulkApplicationResendDTO,
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return await this.scriptRunnerService.bulkApplicationResend(
      req,
      bulkApplicationResendDTO,
    );
  }
}
