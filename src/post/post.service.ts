import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PostEntity } from './post.entity';
import { PostDTO } from './post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity) 
        private postRepository: Repository<PostEntity>
    ){}

    async showAll(){
        return await this.postRepository.find();
    }

    async create(data: PostDTO){
        const post = await this.postRepository.create(data);
        await this.postRepository.save(post);
        return post;
    }
    
    async show(id: string){
        const post = await this.postRepository.findOne({ where: { id } });

        if(!post){
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        }

        return post;
    }

    async update(id: string, data: Partial<PostDTO>){
        let post = await this.postRepository.findOne( { where: { id } } );
        
        if(!post){
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        }
        await this.postRepository.update({ id }, data);
        post = await this.postRepository.findOne({ where: { id } });

        return post;
    }

    async delete(id: string){
        const post = await this.postRepository.findOne( { where: { id } } );
        
        if(!post){
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        }
        await this.postRepository.delete({ id });
        return post;
    }
}
