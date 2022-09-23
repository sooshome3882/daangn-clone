import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/posts/post.entity';
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MannerItem } from './mannerItem.entity';

@Entity()
@ObjectType()
export class SellerReview extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn({ type: 'int' })
  sellerReviewId!: number;

  @Field()
  @Column({ type: 'text' })
  review!: string;

  @Field()
  @Column({ type: 'boolean' })
  retransaction!: boolean;

  @Field()
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt?: Date;

  @Field()
  @DeleteDateColumn({ type: 'datetime' })
  deletedAt?: Date;

  @Field(() => Post)
  @JoinColumn({ name: 'postId' })
  @OneToOne(type => Post, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  post!: Post;

  @Field(() => MannerItem)
  @JoinColumn({ name: 'score' })
  @ManyToOne(type => MannerItem, mannerItem => mannerItem.sellerReview, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  score!: MannerItem;
}
