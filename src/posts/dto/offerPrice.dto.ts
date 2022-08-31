import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsNotEmpty } from 'class-validator';
import { Post } from '../post.entity';

@InputType()
export class OfferPriceDto {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  offerPrice!: number;

  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  post!: Post;
}
