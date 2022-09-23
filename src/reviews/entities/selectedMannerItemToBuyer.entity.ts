import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BuyerReview } from './buyerReview.entity';
import { MannerItem } from './mannerItem.entity';

@Entity()
@ObjectType()
export class SelectedMannerItemToBuyer extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn({ type: 'int' })
  selectedMannerItemId!: number;

  @Field(() => BuyerReview)
  @JoinColumn({ name: 'sellerReviewId' })
  @ManyToOne(type => BuyerReview, buyerReview => buyerReview.selectedMannerItems, { eager: false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  buyerReview!: number;

  @Field(() => MannerItem)
  @JoinColumn({ name: 'mannerItemId' })
  @ManyToOne(type => MannerItem, mannerItem => mannerItem.selectedMannerItem, { eager: false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  mannerItem!: number;

  @Field()
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
