import { Controller, Get } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { AppService } from '../services/app.service';

@Controller()
@ApiExtraModels(SuccessDTO)
@ApiTags('root')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check endpoint',
    operationId: 'healthCheck',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async healthCheck(): Promise<SuccessDTO> {
    return await this.appService.healthCheck();
  }
}
