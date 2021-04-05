import { Test, TestingModule } from '@nestjs/testing';
import { UpdateAppController } from './update-app.controller';

describe('UpdateAppController', () => {
  let controller: UpdateAppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateAppController],
    }).compile();

    controller = module.get<UpdateAppController>(UpdateAppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
