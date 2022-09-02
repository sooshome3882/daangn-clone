import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Post } from '../post.entity';
import { DealState } from 'src/dealStates/dealState.entity';

@InputType()
export class UpdateDealStateDto {
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  dealState!: DealState;
}
