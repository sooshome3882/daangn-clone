import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class ReviewDto {
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  post!: number;

  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  score!: number;

  @Field(() => [Number])
  @IsNotEmpty()
  selectedMannerItems!: number[];

  @Field(() => String)
  review!: string;

  @Field(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  retransaction!: boolean;
}
