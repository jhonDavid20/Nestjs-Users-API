import { IsNotEmpty } from "class-validator";
import { PostEntity } from "post/post.entity";

export class UserDTO {
    
    @IsNotEmpty()
    username: string;
   
    @IsNotEmpty()
    password: string;
}

export class UserRO {
    id: string;
    username: string;
    created: Date;
    token?: string;
    bookmarks?: PostEntity[];
}