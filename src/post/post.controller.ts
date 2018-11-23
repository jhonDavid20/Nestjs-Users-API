import { Controller, Get, Post, Delete, Put, Body, Param, UsePipes, Logger, UseGuards } from '@nestjs/common';

import { PostService } from './post.service';
import { PostDTO } from './post.dto';
import { ValidationPipe } from 'shared/validation.pipe';
import { AuthGuard } from 'shared/auth.guard';
import { User } from '../user/user.decorator';

@Controller('api/post')
export class PostController {
    private logger = new Logger('IdeaController');

    constructor(private postService : PostService){}

    private logData(options: any){
        options.user && this.logger.log('USER ' + JSON.stringify(options.user));
        options.body && this.logger.log('DATA ' + JSON.stringify(options.body));
        options.id && this.logger.log('POST ' + JSON.stringify(options.id));
        
    }

    @Get()
    showAllPosts(){
        return this.postService.showAll();
    }

    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createPost(@User('id') user, @Body() data: PostDTO){
        this.logData({user,data});
        return this.postService.create(user,data);
    }

    @Get(':id')
    showPost(@Param('id') id: string){
        return this.postService.show(id);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    updatePost(@Param('id') id: string,@User('id') user: string, @Body() data: Partial<PostDTO>){
        this.logData({ id, user, data });
        return this.postService.update(id,user,data);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    deletePost(@Param('id') id: string, @User('id') user : string){
        return this.postService.delete(id,user);
    }

    @Post('/bookmark/:id')
    @UseGuards(new AuthGuard())
    bookmarkPost(@Param('id') id: string, @User('id') user: string){
        this.logData({ id, user });
        return this.postService.bookmark(id,user);
    }

    @Delete('/bookmark/:id')
    @UseGuards(new AuthGuard())
    unbookmarkPost(@Param('id') id: string, @User('id') user: string){
        this.logData({ id, user });
        return this.postService.unbookmark(id,user);
    }

    @Post('upvote/:id')
    @UseGuards(new AuthGuard())
    upvotePost(@Param('id') id: string, @User('id') userId: string){
        this.logData({ id, userId });
        return this.postService.upvote(id,userId);
    }

    @Post('downvote/:id')
    @UseGuards(new AuthGuard())
    downvotePost(@Param('id') id: string, @User('id') userId: string){
        this.logData({ id, userId });
        return this.postService.downvote(id,userId);
    }
}
