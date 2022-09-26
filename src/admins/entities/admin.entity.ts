import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { AdminAuthority } from './adminAuthority.entity';

@Entity()
@ObjectType()
export class Admin extends BaseEntity {
  @Field()
  @PrimaryColumn({ type: 'varchar' })
  adminId!: string;

  @Field()
  @Column({ type: 'varchar' })
  adminPw!: string;

  @Field()
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;

  @Field(() => [AdminAuthority])
  @OneToMany(type => AdminAuthority, adminAuthority => adminAuthority.admin, { eager: true })
  authorities!: AdminAuthority[];
}
