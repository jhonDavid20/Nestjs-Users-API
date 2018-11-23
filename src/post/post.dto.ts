import { IsString } from 'class-validator';
import { UserRO } from 'user/user.dto';

export class PostDTO{
    @IsString()
    post : string;

    @IsString()
    description: string;
}

export class PostRO{
    id?: string;
    updated: Date;
    created: Date;
    post: string;
    description: string;
    author: UserRO;
    upvotes?: number;
    downvotes?: number;

}