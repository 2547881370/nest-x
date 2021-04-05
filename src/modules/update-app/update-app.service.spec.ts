import { Test, TestingModule } from '@nestjs/testing';
import { UpdateAppService } from './update-app.service';

describe('UpdateAppService', () => {
  let service: UpdateAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateAppService],
    }).compile();

    service = module.get<UpdateAppService>(UpdateAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
