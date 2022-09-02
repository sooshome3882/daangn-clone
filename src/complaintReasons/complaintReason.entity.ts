import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PostsComplaint } from 'src/posts/postsComplaint.entity';

@Entity()
@ObjectType()
export class ComplaintReason extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ type: 'int' })
  complaintReasonId!: number;

  @Field()
  @Column({ type: 'char' })
  type!: string;

  @Field()
  @Column()
  complaintReason!: string;

  @OneToMany(type => PostsComplaint, postsComplaint => postsComplaint.complaintReason, { eager: false })
  postsComplaint!: PostsComplaint[];
}
