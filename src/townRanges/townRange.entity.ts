import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/posts/post.entity';
import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class TownRange extends BaseEntity {
  @Field()
  @PrimaryColumn({ type: 'int' })
  townRangeId!: number;

  @Field()
  @Column({ type: 'int' })
  townRange!: number;

  @OneToMany(type => Post, post => post.townRange, { eager: false })
  posts!: Post[];
}
