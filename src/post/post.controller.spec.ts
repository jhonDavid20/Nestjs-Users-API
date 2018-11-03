import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';

describe('Post Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [PostController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: PostController = module.get<PostController>(PostController);
    expect(controller).toBeDefined();
  });
});
