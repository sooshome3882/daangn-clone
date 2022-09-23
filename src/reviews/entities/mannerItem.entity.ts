import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { SelectedMannerItemToSeller } from './selectedMannerItemToSeller.entity';

@Entity()
@ObjectType()
export class MannerItem extends BaseEntity {
  @Field(() => Number)
  @PrimaryColumn({ type: 'int' })
  mannerItemId!: number;

  @Field()
  @Column({ type: 'text' })
  mannerItem!: string;

  @OneToMany(type => SelectedMannerItemToSeller, selectedMannerItemToSeller => selectedMannerItemToSeller.mannerItem, { eager: false })
  selectedMannerItem?: SelectedMannerItemToSeller[];
}
