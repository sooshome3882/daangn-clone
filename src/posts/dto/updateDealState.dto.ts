import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Post } from '../entities/post.entity';
import { DealState } from 'src/posts/entities/dealState.entity';

@InputType()
export class UpdateDealStateDto {
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  dealState!: DealState;
}
