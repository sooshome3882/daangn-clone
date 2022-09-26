import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RoleType } from '../models/role.enum';
import { Admin } from './admin.entity';

@Entity()
@ObjectType()
export class AdminAuthority extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ type: 'int' })
  adminAuthorityId!: number;

  @JoinColumn({ name: 'adminId' })
  @ManyToOne(type => Admin, admin => admin.authorities, { eager: false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  admin!: string;

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
