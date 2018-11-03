import { Injectable } from '@nestjs/common';
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
        return await this.postRepository.findOne({ where: { id } });
    }

    async update(id: string, data: Partial<PostDTO>){
        await this.postRepository.update({ id }, data);
        return await this.postRepository.findOne( { id } );
    }

    async delete(id: string){
        await this.postRepository.delete({ id });
        return { deleted : true };
    }
}
