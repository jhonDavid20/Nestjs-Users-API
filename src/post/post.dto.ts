import { IsString } from 'class-validator';

export class PostDTO{
    @IsString()
    post : string;

    @IsString()
    description: string;
}