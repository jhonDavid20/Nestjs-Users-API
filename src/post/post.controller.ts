import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common';

import { PostService } from './post.service';
import { PostDTO } from './post.dto';

@Controller('post')
export class PostController {

    constructor(private postService : PostService){}

    @Get()
    showAllPosts(){
        return this.postService.showAll();
    }

    @Post()
    createPost(@Body() data: PostDTO){
        return this.postService.create(data);
    }

    @Get(':id')
    showPost(@Param('id') id: string){
        return this.postService.show(id);
    }

    @Put(':id')
    updatePost(@Param('id') id: string, @Body() data: Partial<PostDTO>){
        return this.postService.update(id,data);
    }

    @Delete(':id')
    deletePost(@Param('id') id: string){
        return this.postService.delete(id);
    }
}
