import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RoleType } from '../role.enum';
import { Admin } from './admin.entity';

@Entity()
@ObjectType()
export class AdminAuthority extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ type: 'int' })
  adminAuthorityId!: number;

  @Field(() => Admin)
  @ManyToOne(type => Admin, admin => admin.authorities)
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @Field()
  @Column({ type: 'varchar' })
  authority!: RoleType;

  @Field()
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
