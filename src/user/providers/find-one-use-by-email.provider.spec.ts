import { Test, TestingModule } from '@nestjs/testing';
import { FindOneUseByEmailProvider } from './find-one-use-by-email.provider';

describe('FindOneUseByEmailProvider', () => {
  let provider: FindOneUseByEmailProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindOneUseByEmailProvider],
    }).compile();

    provider = module.get<FindOneUseByEmailProvider>(FindOneUseByEmailProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
