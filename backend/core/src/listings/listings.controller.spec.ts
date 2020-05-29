import { Test, TestingModule } from '@nestjs/testing';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';

describe('ListingsController', () => {
  let listingsController: ListingsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ListingsController],
      providers: [ListingsService],
    }).compile();

    listingsController = app.get<ListingsController>(ListingsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(listingsController.getAll()).toBe('Hello World!');
    });
  });
});
