import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToMany, ManyToOne, UpdateDateColumn } from 'typeorm';

import { UserEntity } from 'user/user.entity';

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
}