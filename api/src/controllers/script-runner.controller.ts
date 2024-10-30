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
import { CommunityTypeDTO } from '../dtos/script-runner/community-type.dto';

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
    summary:
      'A script that pulls jurisdiction data from one source into the current db',
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
    summary:
      'A script that pulls listing data from one source into the current db',
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

  @Put('transferJurisdictionPartnerUserData')
  @ApiOperation({
    summary:
      'A script that pulls partner user data from one source into the current db',
    operationId: 'transferJurisdictionPartnerUserData',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async transferJurisdictionPartnerUserData(
    @Body() dataTransferDTO: DataTransferDTO,
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return await this.scriptRunnerService.transferJurisdictionPartnerUserData(
      req,
      dataTransferDTO,
    );
  }

  @Put('transferJurisdictionPublicUserApplicationData')
  @ApiOperation({
    summary:
      'A script that pulls public user and application data from one source into the current db',
    operationId: 'transferJurisdictionPublicUserApplicationData',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async transferJurisdictionPublicUserApplicationData(
    @Body() dataTransferDTO: DataTransferDTO,
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return await this.scriptRunnerService.transferJurisdictionPublicUserAndApplicationData(
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

  @Put('lotteryTranslationsCreateIfEmpty')
  @ApiOperation({
    summary:
      'A script that adds lottery translations to the db and creates them if it does not exist',
    operationId: 'lotteryTranslations',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async lotteryTranslationsCreateIfEmpty(
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return await this.scriptRunnerService.addLotteryTranslationsCreateIfEmpty(
      req,
    );
  }

  @Put('optOutExistingLotteries')
  @ApiOperation({
    summary: 'A script that opts out existing lottery listings',
    operationId: 'optOutExistingLotteries',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async optOutExistingLotteries(
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return await this.scriptRunnerService.optOutExistingLotteries(req);
  }

  @Put('addDuplicatesInformationToLotteryEmail')
  @ApiOperation({
    summary: 'A script that adds duplicates information to lottery email',
    operationId: 'addDuplicatesInformationToLotteryEmail',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async addDuplicatesInformationToLotteryEmail(
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return await this.scriptRunnerService.addDuplicatesInformationToLotteryEmail(
      req,
    );
  }

  @Put('createNewReservedCommunityType')
  @ApiOperation({
    summary: 'A script that creates a new reserved community type',
    operationId: 'createNewReservedCommunityType',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async createNewReservedCommunityType(
    @Body() body: CommunityTypeDTO,
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return await this.scriptRunnerService.createNewReservedCommunityType(
      req,
      body.id,
      body.name,
      body.description,
    );
  }
  @Put('updateCodeExpirationTranslations')
  @ApiOperation({
    summary:
      'A script that updates single use code translations to show extended expiration time',
    operationId: 'updateCodeExpirationTranslations',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async updateCodeExpirationTranslations(
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return await this.scriptRunnerService.updateCodeExpirationTranslations(req);
  }
}
