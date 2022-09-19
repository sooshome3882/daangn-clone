import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/posts/post.entity';
import { PostsLikeRecord } from 'src/posts/postsLikeRecord.entity';
import { PurchaseHistory } from 'src/mypage/purchaseHistory.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Followings } from '../mypage/followings.entity';
import { PostsViewRecord } from 'src/posts/postsViewRecord.entity';
import { Location } from './location.entity';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field()
  @PrimaryColumn({ type: 'varchar', length: 11, unique: true })
  phoneNumber!: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 30, unique: true, nullable: true })
  userName?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  profileImage?: string;

  @Field()
  @Column({ type: 'decimal', precision: 3, scale: 1, default: 36.5 })
  mannerTemp!: number;

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  respTime?: number;

  @Field()
  @Column({ type: 'boolean' })
  marketingInfoAgree!: boolean;

  @Field()
  @Column({ type: 'boolean', default: false })
  suspensionOfUse!: boolean;

  @Field()
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;

  @OneToMany(type => Post, post => post.user, { eager: false })
  posts!: Post[];

  @OneToMany(type => PostsLikeRecord, postsLikeRecord => postsLikeRecord.post, { eager: false })
  postsLikeRecord!: PostsLikeRecord[];

  @OneToMany(type => PostsViewRecord, postsViewRecord => postsViewRecord.user, { eager: false })
  postsViewRecord!: PostsViewRecord;

  @OneToMany(type => Followings, followings => followings.followingUser, { eager: false })
  followings!: Followings[];

  @OneToMany(type => Followings, followings => followings.followerUser, { eager: false })
  followers!: Followings[];

  @OneToMany(type => PurchaseHistory, purchaseHistory => purchaseHistory.user, { eager: false })
  purchaseHistory!: PurchaseHistory[];

  @OneToMany(type => Location, location => location.user, { eager: false })
  locations!: Location[];
}
