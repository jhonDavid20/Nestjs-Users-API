import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';

describe('Comment Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [CommentController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: CommentController = module.get<CommentController>(CommentController);
    expect(controller).toBeDefined();
  });
});
