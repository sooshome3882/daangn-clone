import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { SellerReview } from './sellerReview.entity';

@Entity()
@ObjectType()
export class MannerItem extends BaseEntity {
  @Field(() => Number)
  @PrimaryColumn({ type: 'int' })
  mannerItemId!: number;

  @Field()
  @Column({ type: 'text' })
  mannerItem!: string;

  @OneToMany(type => SellerReview, sellerReview => sellerReview.score, { eager: false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  sellerReview?: number;
}
