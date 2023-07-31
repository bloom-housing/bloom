import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../../../src/services/app.service';

describe('Testing app service', () => {
  let service: AppService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should return a successDTO with success true', () => {
    expect(service.heartbeat()).toEqual({
      success: true,
    });
  });
});
