import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, MaxLength } from "class-validator";
import { Category } from "src/categories/category.entity";
import { DealState } from "src/dealStates/dealState.entity";
import { TownRange } from "src/townRanges/townRange.entity";

@InputType()
export class CreatePostDto {
  @Field()
  @IsNotEmpty()
  @MaxLength(30)
  title!: string;

  @Field()
  @IsNotEmpty()
  content!: string;

  @Field(() => Number)
  @IsNotEmpty()
  category!: Category

  @Field()
  @IsNotEmpty()
  price!: number

  @Field()
  @IsNotEmpty()
  isOfferedPrice!: boolean

  @Field(() => Number)
  @IsNotEmpty()
  townRange!: TownRange

  @Field(() => Number)
  @IsNotEmpty()
  dealState!: DealState
}