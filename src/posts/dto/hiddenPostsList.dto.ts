import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, Min } from 'class-validator';

@InputType()
export class HiddenPostsListDto {
  @Field({ nullable: true, defaultValue: 10 })
  @IsNumber()
  @Min(1)
  perPage?: number;

  @Field({ nullable: true, defaultValue: 1 })
  @IsNumber()
  @Min(1)
  page?: number;
}
