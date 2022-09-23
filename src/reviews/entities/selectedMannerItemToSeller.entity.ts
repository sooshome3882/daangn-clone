import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MannerItem } from './mannerItem.entity';
import { SellerReview } from './sellerReview.entity';

@Entity()
@ObjectType()
export class SelectedMannerItemToSeller extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn({ type: 'int' })
  selectedMannerItemId!: number;

  @Field(() => SellerReview)
  @JoinColumn({ name: 'sellerReviewId' })
  @ManyToOne(type => SellerReview, sellerReview => sellerReview.selectedMannerItems, { eager: false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  sellerReview!: number;

  @Field(() => MannerItem)
  @JoinColumn({ name: 'mannerItemId' })
  @ManyToOne(type => MannerItem, mannerItem => mannerItem.mannerItemToSeller, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  mannerItem!: number;

  @Field()
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
