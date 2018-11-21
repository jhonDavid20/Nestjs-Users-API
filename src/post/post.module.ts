import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostEntity } from './post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserEntity } from 'user/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity])],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
