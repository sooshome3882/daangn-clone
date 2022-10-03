import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, Min } from 'class-validator';

@InputType()
export class SearchPostDto {
  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true, defaultValue: 0 })
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @Field({ nullable: true, defaultValue: -1 })
  @IsNumber()
  maxPrice?: number;

  @Field(() => Number, { nullable: true })
  category?: number;

  @Field(() => Number, { nullable: true })
  townRange?: number;

  @Field(() => Number, { nullable: true })
  dealState?: number;

  @Field({ nullable: true, defaultValue: 10 })
  @IsNumber()
  @Min(1)
  perPage?: number;

  @Field({ nullable: true, defaultValue: 1 })
  @IsNumber()
  @Min(1)
  page?: number;
}
