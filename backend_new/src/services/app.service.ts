import { Injectable } from '@nestjs/common';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async heartbeat(): Promise<SuccessDTO> {
    await this.prisma.$queryRaw`SELECT 1`;
    return {
      success: true,
    } as SuccessDTO;
  }
}
