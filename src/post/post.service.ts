import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PostEntity } from './post.entity';
import { PostDTO, PostRO } from './post.dto';
import { UserEntity } from 'user/user.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity) 
        private postRepository: Repository<PostEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ){}

    private toResponseObject(post: PostEntity): PostRO{
        return {...post, author: post.author.toResponseObject(false)};
    }

    private ensureOwnership(post: PostEntity, userId: string){
        if(post.author.id !== userId){
            throw new HttpException('Incorrect User', HttpStatus.UNAUTHORIZED);
        }

    }

    async showAll(): Promise<PostRO[]>{
       const post = await this.postRepository.find({ relations: ['author']});
       return post.map(post => this.toResponseObject(post));
    }

    async create(userId: string, data: PostDTO): Promise<PostRO>{
        const user = await this.userRepository.findOne({ id : userId  });
        console.log(user);
        const post = await this.postRepository.create({...data, author: user});
        await this.postRepository.save(post);
        return this.toResponseObject(post);
    }
    
    async show(id: string): Promise<PostRO>{
        const post = await this.postRepository.findOne( { id : id }, { relations: ['author'] });

        if(!post){
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        }

        return this.toResponseObject(post);
    }

    async update(id: string, userId: string, data: Partial<PostDTO>): Promise<PostRO>{
        let post = await this.postRepository.findOne( { id:  id }, {relations: ['author'] } );
        
        if(!post){
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(post,userId);
        await this.postRepository.update({ id: id }, data);
        post = await this.postRepository.findOne({ id:  id  }, {relations: ['author'] } );

        return this.toResponseObject(post);
    }

    async delete(id: string, userId: string){
        const post = await this.postRepository.findOne( { id:  id  }, {relations: ['author'] } );
        
        if(!post){
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(post,userId);
        await this.postRepository.delete({ id: id });
        return post;
    }
}
