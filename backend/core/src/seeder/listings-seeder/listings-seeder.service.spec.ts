import { Test, TestingModule } from '@nestjs/testing';
import { ListingsSeederService } from './listings-seeder.service';

describe('ListingsSeederService', () => {
  let service: ListingsSeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListingsSeederService],
    }).compile();

    service = module.get<ListingsSeederService>(ListingsSeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
