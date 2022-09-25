import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

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
  @Column({ type: 'int' })
  permission!: number;

  @Field()
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
