import { AdminOrJurisdictionalAdminGuard } from '../guards/admin-or-jurisdiction-admin.guard';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { IdDTO } from '../dtos/shared/id.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { SnapshotCreateService } from '../services/snapshot-create.service';
import { SuccessDTO } from '../dtos/shared/success.dto';

@Controller('snapshot')
@ApiTags('snapshot')
@UseGuards(ApiKeyGuard, JwtAuthGuard, AdminOrJurisdictionalAdminGuard)
export class SnapshotCreateController {
  constructor(private readonly snapshotCreateService: SnapshotCreateService) {}

  @Put('createUserSnapshot')
  @ApiOperation({
    summary: 'Create User Snapshot',
    operationId: 'createUserSnapshot',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async createUserSnapshot(@Body() idDTO: IdDTO): Promise<SuccessDTO> {
    return await this.snapshotCreateService.createUserSnapshot(idDTO.id);
  }

  @Put('createListingSnapshot')
  @ApiOperation({
    summary: 'Create Listing Snapshot',
    operationId: 'createListingSnapshot',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async createListingSnapshot(@Body() idDTO: IdDTO): Promise<SuccessDTO> {
    return await this.snapshotCreateService.createListingSnapshot(idDTO.id);
  }
}
