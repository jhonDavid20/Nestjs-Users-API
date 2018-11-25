import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PostEntity } from './post.entity';
import { PostDTO, PostRO } from './post.dto';
import { UserEntity } from 'user/user.entity';
import { Votes } from 'shared/votes.enum';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity) private postRepository: Repository<PostEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
        ){}

    private toResponseObject(post: PostEntity): PostRO{
        const responseObject: any = { ...post, author: post.author.toResponseObject(false) };
        if ( responseObject.upvotes ){
            responseObject.upvotes = post.upvotes.length;
        }
        if(responseObject.downvotes){
            responseObject.downvotes = post.downvotes.length;
        }

        return responseObject;
    }

    private ensureOwnership(post: PostEntity, userId: string){
        if (post.author.id !== userId){
            throw new HttpException('Incorrect User', HttpStatus.UNAUTHORIZED);
        }

    }

    private async vote(post: PostEntity, user: UserEntity, vote: Votes){
        const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
        if(
            post[opposite].filter(voter => voter.id === user.id).length > 0 ||
            post[vote].filter(voter => voter.id === user.id).length > 0
        ){
            post[opposite] = post[opposite].filter(voter => voter.id !== user.id);
            post[vote] = post[vote].filter(voter => voter.id !== user.id);
            await this.postRepository.save(post);
        }else if(post[vote].filter(voter => voter.id === user.id).length < 1){
            post[vote].push(user);
            await this.postRepository.save(post);
        }else{
            throw new HttpException('Unable to cast vote', HttpStatus.BAD_REQUEST);
        }
        
        return post;
    }

    async showAll(): Promise<PostRO[]>{
       const post = await this.postRepository.find({ relations: ['author', 'upvotes', 'downvotes', 'comments']});
       return post.map(post => this.toResponseObject(post));
    }

    async create(userId: string, data: PostDTO): Promise<PostRO>{
        const user = await this.userRepository.findOne({ id : userId  });
        const post = await this.postRepository.create({...data, author: user});
        await this.postRepository.save(post);
        return this.toResponseObject(post);
    }

    async show(id: string): Promise<PostRO>{
        const post = await this.postRepository.findOne( { id: id }, { relations: ['author', 'upvotes', 'downvotes', 'comments'] });

        if (!post){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
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
        post = await this.postRepository.findOne({ id:  id  }, {relations: ['author', 'comments'] } );

        return this.toResponseObject(post);
    }

    async delete(id: string, userId: string){
        const post = await this.postRepository.findOne( { id:  id  }, {relations: ['author', 'comments'] } );
        
        if(!post){
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(post,userId);
        await this.postRepository.delete({ id: id });
        return post;
    }

    async bookmark(id: string, userId: string){
        console.log(id + '\n' + userId + '\n');
        const post = await this.postRepository.findOne({ id: id});
        const user = await this.userRepository.findOne({ id: userId}, {relations: ['bookmarks']});

        console.log(post + '\n' + user);
        if(user.bookmarks.filter(bookmark => bookmark.id === post.id).length < 1){
            user.bookmarks.push(post);
            await this.userRepository.save(user);
        }else{
            throw new HttpException('Post already bookmarked', HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject(false);

    }

    async unbookmark(id: string, userId: string){
        const post = await this.postRepository.findOne({ id : id});
        const user = await this.userRepository.findOne({ id: userId}, {relations: ['bookmarks']});

        if(user.bookmarks.filter(bookmark => bookmark.id === post.id).length > 0){
            user.bookmarks = user.bookmarks.filter(bookmark => bookmark.id !== post.id);
            await this.userRepository.save(user);
        }else{
            throw new HttpException('Post already unbookmarked', HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject();

    }

    async upvote(id: string, userId: string){
        let post = await this.postRepository.findOne({ id: id}, {relations: ['author', 'upvotes', 'downvotes', 'comments'] });
        const user = await this.userRepository.findOne({ id: userId});
       
        post = await this.vote(post,user,Votes.UP);

        return this.toResponseObject(post);
    }

    async downvote(id: string, userId: string){
        let post = await this.postRepository.findOne({ id: id}, {relations: ['author','upvotes', 'downvotes', 'comments'] });
        const user = await this.userRepository.findOne({ id: userId});
       
        post = await this.vote(post,user,Votes.DOWN);

        return this.toResponseObject(post);
    }
}
