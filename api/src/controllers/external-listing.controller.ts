import {
  Controller,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { ExternalListingService } from '../services/external-listing.service';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';

@Controller('externalListings')
@ApiTags('externalListings')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@PermissionTypeDecorator('externalListings')
@UseGuards(ApiKeyGuard, JwtAuthGuard, PermissionGuard)
export class ExternalListingController {
  constructor(
    private readonly externalListingService: ExternalListingService,
  ) {}
}
