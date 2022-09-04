import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Category } from 'src/categories/category.entity';
import { DealState } from 'src/dealStates/dealState.entity';
import { TownRange } from 'src/townRanges/townRange.entity';
import { User } from 'src/users/user.entity';
import { PriceOffer } from './priceOffer.entity';
import { PostsComplaint } from './postsComplaint.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ type: 'int' })
  postId!: number;

  @Field()
  @Column({ type: 'varchar', length: 30 })
  title!: string;

  @Field()
  @Column({ type: 'text' })
  content!: string;

  @Field()
  @Column()
  price!: number;

  @Field(type => Boolean)
  @Column({ default: false, type: 'boolean' })
  isOfferedPrice!: boolean;

  @Field()
  @Column({ type: 'boolean', default: false })
  isHidden!: boolean;

  @Field()
  @Column({ type: 'boolean', default: false })
  reportHandling!: boolean;

  @Field()
  @Column({ type: 'int', default: 0 })
  likes!: number;

  @Field()
  @Column({ type: 'int', default: 0 })
  views!: number;

  @Field()
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;

  @Field()
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  pulledAt!: Date;

  @Field(() => User)
  @JoinColumn({ name: 'userName' })
  @ManyToOne(type => User, user => user.posts, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  phoneNumber!: User;

  @Field()
  @JoinColumn({ name: 'categoryId' })
  @ManyToOne(type => Category, category => category.posts, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  category!: Category;

  @Field()
  @JoinColumn({ name: 'townRangeId' })
  @ManyToOne(type => TownRange, townRange => townRange.posts, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  townRange!: TownRange;

  @Field()
  @JoinColumn({ name: 'dealStateId' })
  @ManyToOne(type => DealState, dealState => dealState.posts, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  dealState!: DealState;

  @OneToMany(type => PriceOffer, priceOffer => priceOffer.post)
  priceOffer!: PriceOffer[];

  @OneToMany(type => PostsComplaint, postsComplaint => postsComplaint.post, { eager: false })
  postsComplaint!: PostsComplaint[];
}
