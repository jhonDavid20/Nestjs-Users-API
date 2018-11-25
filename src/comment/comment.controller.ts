import { Controller, Get, Param, Post, UseGuards, UsePipes, Body, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'shared/auth.guard';
import { ValidationPipe } from 'shared/validation.pipe';
import { User } from 'user/user.decorator';
import { CommentDTO } from './comment.dto';

@Controller('api/comments')
export class CommentController {
    constructor(private commentService: CommentService){

    }

    @Get('post/:id')
    showCommentsByPost(@Param('id') post: string){
        return this.commentService.showByPost(post);
    }

 
   @Get('user/:id')
    showCommentsByUser(@Param('id') user: string){
        return this.commentService.showByUser(user);
    }

    @Post('post/:id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createComment(@Param('id') post: string, @User('id') user: string,@Body() data: CommentDTO){
        return this.commentService.create(post,user,data);
    }

    @Get(':id')
    showComment(@Param('id') id: string){
        return this.commentService.show(id);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    deleteComment(@Param('id') id: string,@User('id') user: string){
        return this.commentService.destroy(id,user);
    }
}
