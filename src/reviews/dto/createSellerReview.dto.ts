import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateSellerReviewDto {
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  postId!: number;

  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  score!: number;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  review!: string;

  @Field(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  retransaction!: boolean;
}
