import { Field, ObjectType } from "@nestjs/graphql";
import { Post } from "src/posts/post.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({type: 'int'})
  userId!: number;

  @Field()
  @Column({type: 'varchar', length: 11, unique: true})
  phoneNumber!: string;

  @Field()
  @Column({type: 'varchar', length: 30, unique: true})
  userName!: string;

  @Field()
  @Column({type: 'varchar', length: 255, nullable: true})
  profileImage: string | null;

  @Field()
  @Column({type: 'float', default: 36.5})
  mannerTemp!: number;

  @Field()
  @Column({type: 'int', nullable: true})
  respTime: number;

  @Field()
  @Column({type: 'boolean'})
  marketingInfoAgree!: boolean;

  @Field()
  @Column({type: 'boolean', default: false})
  suspensionOfUse!: boolean;

  @Field()
  @CreateDateColumn({type: 'datetime'})
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({type: 'datetime'})
  updatedAt!: Date;

  @OneToMany(type => Post, post => post.userName, { eager: false })
  posts: Post[]
}