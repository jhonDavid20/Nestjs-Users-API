import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PostModule } from './post/post.module';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from 'shared/logging.interceptor';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';





@Module({
  imports: [TypeOrmModule.forRoot(), PostModule, UserModule, CommentModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
    provide: APP_FILTER,
    useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
      }
  ],
})
export class AppModule {}
