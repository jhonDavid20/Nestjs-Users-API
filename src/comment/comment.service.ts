import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository, createQueryBuilder } from 'typeorm';

import { UserEntity } from 'user/user.entity';
import { PostEntity } from 'post/post.entity';
import { CommentDTO } from './comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity) 
        private commentRepository: Repository<CommentEntity>,
        @InjectRepository(UserEntity) 
        private userRepository: Repository<UserEntity>,
        @InjectRepository(PostEntity) 
        private postEntity: Repository<PostEntity>,
    
        ){}

        private toResponseObject(comment: CommentEntity){
            const responseObject: any = comment;

            if(comment.author){
                responseObject.author = comment.author.toResponseObject();
            }

            return responseObject;
        }

        async showByPost(id: string){
            const post = await this.postEntity.findOne({id:id}, {relations: ['comments', 'comments.author', 'comments.post']});
        
            return post.comments.map(comment => this.toResponseObject(comment));
        }
        //Watch this...
        async showByUser(userId: string){
            const comments = await this.commentRepository.find({
                where: { author: userId },
                relations: ['author']
            });
        
            return comments.map(comment => this.toResponseObject(comment));
        }

        async show(id: string){
            const comment = await this.commentRepository.findOne({id:id}, {relations: ['author','post']});

            return this.toResponseObject(comment);
        }

        async create(postId: string, userId: string, data: CommentDTO){
            const post = await this.postEntity.findOne({id: postId});
            const user = await this.userRepository.findOne({id:userId});

            const comment = await this.commentRepository.create(
                {...data,
                    post,
                    author:user
                });
            await this.commentRepository.save(comment);

            return this.toResponseObject(comment);
        }

        async destroy(id: string, userId: string){
            const comment = await this.commentRepository.findOne({id:id}, {relations:['author', 'post']});

            if(comment.author.id != userId){
                throw new HttpException('User isn`t owner', HttpStatus.UNAUTHORIZED);
            }
            
            await this.commentRepository.remove(comment);

            return this.toResponseObject(comment);
        }
}