import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../../../src/services/app.service';
import { PrismaService } from '../../../src/services/prisma.service';

describe('Testing app service', () => {
  let service: AppService;
  let prisma: PrismaService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService, PrismaService],
    }).compile();

    service = module.get<AppService>(AppService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return a successDTO with success true', async () => {
    prisma.$queryRaw = jest.fn().mockResolvedValue(1);
    expect(await service.heartbeat()).toEqual({
      success: true,
    });
    expect(prisma.$queryRaw).toHaveBeenCalled();
  });
});
