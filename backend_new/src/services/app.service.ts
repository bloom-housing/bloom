import { Injectable } from '@nestjs/common';
import { SuccessDTO } from '../dtos/shared/success.dto';

@Injectable()
export class AppService {
  heartbeat(): SuccessDTO {
    return {
      success: true,
    } as SuccessDTO;
  }
}
