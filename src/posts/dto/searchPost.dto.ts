import { Field, InputType } from "@nestjs/graphql";
import { IsNumber, Min } from "class-validator";
import { Category } from "src/categories/category.entity";
import { DealState } from "src/dealStates/dealState.entity";
import { TownRange } from "src/townRanges/townRange.entity";

@InputType()
export class SearchPostDto {
  @Field({nullable: true})
  search: string;

  @Field({nullable: true, defaultValue: 0})
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @Field({nullable: true, defaultValue: -1})
  @IsNumber()
  maxPrice?: number;

  @Field(() => Number, {nullable: true})
  category?: Category

  @Field(() => Number, {nullable: true})
  townRange?: TownRange

  @Field(() => Number, {nullable: true})
  dealState?: DealState

  @Field({nullable: true, defaultValue: 10})
  @IsNumber()
  @Min(1)
  perPage?: number

  @Field({nullable: true, defaultValue: 1})
  @IsNumber()
  @Min(1)
  page?: number
}