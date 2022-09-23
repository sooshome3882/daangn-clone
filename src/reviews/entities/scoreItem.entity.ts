import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BuyerReview } from './buyerReview.entity';
import { SellerReview } from './sellerReview.entity';

@Entity()
@ObjectType()
export class ScoreItem extends BaseEntity {
  @Field(() => Number)
  @PrimaryColumn({ type: 'int' })
  scoreItemId!: number;

  @Field()
  @Column({ type: 'text' })
  score!: string;

  @OneToMany(type => SellerReview, sellerReview => sellerReview.score, { eager: false })
  sellerReview!: SellerReview[];

  @OneToMany(type => BuyerReview, buyerReview => buyerReview.score, { eager: false })
  buyerReview!: BuyerReview[];
}
