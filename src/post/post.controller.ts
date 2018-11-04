import { Controller, Get, Post, Delete, Put, Body, Param, UsePipes, Logger } from '@nestjs/common';

import { PostService } from './post.service';
import { PostDTO } from './post.dto';
import { ValidationPipe } from 'shared/validation.pipe';

@Controller('api/post')
export class PostController {
    private logger = new Logger('IdeaController');

    constructor(private postService : PostService){}

    @Get()
    showAllPosts(){
        return this.postService.showAll();
    }

    @Post()
    @UsePipes(new ValidationPipe())
    createPost(@Body() data: PostDTO){
        this.logger.log(JSON.stringify(data));
        return this.postService.create(data);
    }

    @Get(':id')
    showPost(@Param('id') id: string){
        return this.postService.show(id);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    updatePost(@Param('id') id: string, @Body() data: Partial<PostDTO>){
        this.logger.log(JSON.stringify(data));
        return this.postService.update(id,data);
    }

    @Delete(':id')
    deletePost(@Param('id') id: string){
        return this.postService.delete(id);
    }
}
