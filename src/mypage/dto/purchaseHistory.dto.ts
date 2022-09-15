import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Post } from '../../posts/post.entity';

@InputType()
export class PurchaseHistoryDto {
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  post!: Post;
}
