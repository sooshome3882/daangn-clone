import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TownRange } from 'src/townRanges/townRange.entity';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class Location extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn({ type: 'int' })
  locationId!: number;

  @Field()
  @Column({ type: 'varchar', length: 30 })
  siDo!: string;

  @Field()
  @Column({ type: 'varchar', length: 30 })
  siGunGu!: string;

  @Field()
  @Column({ type: 'varchar', length: 30 })
  eupMyeonDong!: string;

  @Field()
  @Column({ type: 'boolean', default: false })
  isConfirmedPosition!: boolean;

  @Field()
  @Column({ type: 'boolean', default: true })
  isSelected!: boolean;

  @Field()
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @Field()
  @DeleteDateColumn({ type: 'datetime' })
  deletedAt!: Date;

  @Field(() => User)
  @JoinColumn({ name: 'phoneNumber' })
  @ManyToOne(type => User, user => user.locations, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  user!: string;

  @Field()
  @JoinColumn({ name: 'townRangeId' })
  @Column({ type: 'int', default: 2 })
  @ManyToOne(type => TownRange, townRange => townRange.locations, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  townRangeId!: number;
}
