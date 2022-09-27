import { UserComplaints } from './../chats/userComplaints.entity';
import { ChatComplaints } from './../chats/chatComplaints.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostsComplaint } from '../posts/postsComplaint.entity';

@Entity()
@ObjectType()
export class ProcessState extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ type: 'int' })
  processStateId!: number;

  @Field()
  @Column({ type: 'varchar' })
  processState!: string;

  @OneToMany(type => PostsComplaint, postsComplaint => postsComplaint.processState, { eager: false })
  postsComplaint!: PostsComplaint[];

  @OneToMany(type => ChatComplaints, chatComplaints => chatComplaints.processState, { eager: false })
  chatComplaints!: ChatComplaints[];

  @OneToMany(type => UserComplaints, userComplaints => userComplaints.processState, { eager: false })
  userComplaints!: UserComplaints[];
}
