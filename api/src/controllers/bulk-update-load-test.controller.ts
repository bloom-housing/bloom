import { Body, Controller, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { ScriptRunnerService } from '../services/script-runner.service';
import { BulkUpdateLoadTestDTO } from '../dtos/script-runner/bulk-update-load-test.dto';
import { BulkUpdateSeedDTO } from '../dtos/script-runner/bulk-update-seed.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';

@Controller('scriptRunner')
@ApiTags('scriptRunner')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@UseGuards(ApiKeyGuard)
export class BulkUpdateLoadTestController {
  constructor(private readonly scriptRunnerService: ScriptRunnerService) {}

  @Put('seedApplicationsForLoadTest')
  @ApiOperation({
    summary:
      'Seeds realistic applications for a listing to use with bulkUpdateLoadTest. Safe to call multiple times.',
    operationId: 'seedApplicationsForLoadTest',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async seedApplicationsForLoadTest(
    @Body() dto: BulkUpdateSeedDTO,
  ): Promise<SuccessDTO> {
    return await this.scriptRunnerService.seedApplicationsForLoadTest(dto);
  }

  @Put('bulkUpdateLoadTest')
  @ApiOperation({
    summary:
      'POC load test (Option 2): read → snapshot → write per record. Check server logs for timing output.',
    operationId: 'bulkUpdateLoadTest',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async bulkUpdateLoadTest(
    @Body() dto: BulkUpdateLoadTestDTO,
  ): Promise<SuccessDTO> {
    return await this.scriptRunnerService.bulkUpdateLoadTest(dto);
  }

  @Put('bulkUpdateTransactionLoadTest')
  @ApiOperation({
    summary:
      'POC load test (Option 1): bulk read → N snapshots → single $transaction. Check server logs for timing output.',
    operationId: 'bulkUpdateTransactionLoadTest',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async bulkUpdateTransactionLoadTest(
    @Body() dto: BulkUpdateLoadTestDTO,
  ): Promise<SuccessDTO> {
    return await this.scriptRunnerService.bulkUpdateTransactionLoadTest(dto);
  }
}
