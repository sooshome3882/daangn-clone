import { Field, ObjectType } from '@nestjs/graphql';
import { ComplaintReason } from 'src/complaintReasons/complaintReason.entity';
import { ProcessState } from 'src/processStates/processState.entity';
import { User } from 'src/users/user.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
@ObjectType()
export class UserComplaints extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ type: 'int' })
  complaintId!: number;

  @Field(() => ComplaintReason)
  @JoinColumn({ name: 'complaintReasonId' })
  @ManyToOne(type => ComplaintReason, complaintReason => complaintReason.userComplaints, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  complaintReason!: ComplaintReason;

  @Field(() => ProcessState)
  @JoinColumn({ name: 'processStateId' })
  @ManyToOne(type => ProcessState, processState => processState.userComplaints, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  processState!: ProcessState;

  @Field(() => User)
  @JoinColumn({ name: 'complaintUserPhoneNumber' })
  @ManyToOne(type => User, user => user.complaintUserPhoneNumber, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  complaintUserPhoneNumber!: User;

  @Field(() => User)
  @JoinColumn({ name: 'subjectUserPhoneNumber' })
  @ManyToOne(type => User, user => user.subjectUserPhoneNumber, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  subjectUserPhoneNumber!: User;

  @Field()
  @Column({ type: 'text', nullable: true })
  memo!: string;

  @Field()
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
