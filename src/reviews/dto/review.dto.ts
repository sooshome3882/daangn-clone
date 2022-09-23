import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsString()
  review?: string;

  @Field(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  retransaction!: boolean;
}
