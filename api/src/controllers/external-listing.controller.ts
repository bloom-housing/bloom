import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Put,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { PermissionGuard } from '../guards/permission.guard';
import { ExternalListingService } from '../services/external-listing.service';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { ExternalizedDetails } from '../dtos/external-listings/externalized-details.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { PermissionAction } from '../decorators/permission-action.decorator';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { IngestParams } from '../dtos/external-listings/ingest-params.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('externalListings')
@ApiTags('externalListings')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@PermissionTypeDecorator('externalListings')
export class ExternalListingController {
  constructor(
    private readonly externalListingService: ExternalListingService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get an object of externalized system data details',
    operationId: 'externalize',
  })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: ExternalizedDetails })
  async externalize() {
    return await this.externalListingService.externalize();
  }

  @Put('ingest')
  @ApiOperation({
    summary: 'Ingest listing data from an external Bloom instance',
    operationId: 'ingest',
  })
  @PermissionAction(permissionActions.submit)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: SuccessDTO })
  async ingest(@Body() dto: IngestParams): Promise<SuccessDTO> {
    return await this.externalListingService.ingest(dto);
  }
}
