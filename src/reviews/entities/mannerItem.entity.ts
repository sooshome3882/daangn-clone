import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { SelectedMannerItemToBuyer } from './selectedMannerItemToBuyer.entity';
import { SelectedMannerItemToSeller } from './selectedMannerItemToSeller.entity';

@Entity()
@ObjectType()
export class MannerItem extends BaseEntity {
  @Field(() => String)
  @PrimaryColumn({ type: 'varchar' })
  mannerItemId!: string;

  @Field()
  @Column({ type: 'text' })
  mannerItem!: string;

  @OneToMany(type => SelectedMannerItemToSeller, selectedMannerItemToSeller => selectedMannerItemToSeller.mannerItem, { eager: false })
  mannerItemToSeller?: SelectedMannerItemToSeller[];

  @OneToMany(type => SelectedMannerItemToBuyer, selectedMannerItemToBuyer => selectedMannerItemToBuyer.mannerItem, { eager: false })
  mannerItemToBuyer?: SelectedMannerItemToBuyer[];
}
