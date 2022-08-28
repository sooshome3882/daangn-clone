import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Post } from "src/posts/post.entity";
import {BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryColumn} from 'typeorm';

@Entity()
@ObjectType()
export class Category extends BaseEntity {
  @Field()
  @PrimaryColumn({type: 'int'})
  categoryId!: number;

  @Field()
  @Column({type: 'varchar'})
  category!: string; 

  @Field(type => [Post])
  @OneToMany(type => Post, post => post.category, { eager: false })
  posts!: Post[];
}