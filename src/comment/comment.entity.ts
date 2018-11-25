import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, JoinTable } from 'typeorm';
import { UserEntity } from 'user/user.entity';
import { PostEntity } from 'post/post.entity';

@Entity('comment')
export class CommentEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @Column('text')
    comment: string;

    @ManyToOne(type => UserEntity)
    @JoinTable()
    author: UserEntity;

    @ManyToOne(type => PostEntity, post => post.comments)
    post: PostEntity;
}