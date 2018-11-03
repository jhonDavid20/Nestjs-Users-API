import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column } from 'typeorm';

@Entity('post')
export class PostEntity{
    @PrimaryGeneratedColumn('uuid') 
    id : string;

    @CreateDateColumn() 
    created : Date;

    @Column('text') 
    post : string;

    @Column('text') 
    description : string;
}