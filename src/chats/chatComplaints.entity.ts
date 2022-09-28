import { User } from 'src/users/user.entity';
import { Chat } from './chat.entity';
import { ProcessState } from './../processStates/processState.entity';
import { ComplaintReason } from './../complaintReasons/complaintReason.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ChatComplaints extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn({ type: 'int' })
  complaintId!: number;

  @Field(() => Chat)
  @JoinColumn({ name: 'chatId' })
  @ManyToOne(type => Chat, chat => chat.chatComplaints, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  chat!: Chat;

  @Field(() => ComplaintReason)
  @JoinColumn({ name: 'complaintReasonId' })
  @ManyToOne(type => ComplaintReason, complaintReason => complaintReason.chatComplaints, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  complaintReason!: ComplaintReason;

  @Field(() => ProcessState)
  @JoinColumn({ name: 'processState' })
  @Column({ type: 'int', default: 1 })
  @ManyToOne(type => ProcessState, processState => processState.chatComplaints, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  processState!: ProcessState;

  @Field(() => User)
  @JoinColumn({ name: 'complaintUserPhoneNumber' })
  @ManyToOne(type => User, user => user.chatComplaints, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  user!: User;

  @Field()
  @Column({ type: 'text', nullable: true })
  memo!: string;

  @Field()
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
