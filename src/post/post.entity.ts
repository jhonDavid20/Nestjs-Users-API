import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToMany, ManyToOne, UpdateDateColumn, JoinTable, OneToMany } from 'typeorm';

import { UserEntity } from 'user/user.entity';
import { CommentEntity } from 'comment/comment.entity';

@Entity('post')
export class PostEntity{
    @PrimaryGeneratedColumn('uuid') 
    id : string;

    @CreateDateColumn() 
    created : Date;

    @UpdateDateColumn()
    updated: Date;
    
    @Column('text') 
    post : string;

    @Column('text') 
    description : string;

    @ManyToOne(type => UserEntity, author => author.post)
    author: UserEntity;

    @ManyToMany(type => UserEntity, {cascade:true})
    @JoinTable()
    upvotes: UserEntity[];

    @ManyToMany(type => UserEntity, {cascade:true})
    @JoinTable()
    downvotes: UserEntity[];

    @OneToMany(type => CommentEntity, comment => comment.post, {cascade: true})
    comments: CommentEntity[];
}