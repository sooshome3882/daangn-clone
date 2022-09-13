import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { Category } from 'src/categories/category.entity';
import { DealState } from 'src/dealStates/dealState.entity';
import { TownRange } from 'src/townRanges/townRange.entity';
import { FileUpload } from 'src/users/models/fileUpload.model';

@InputType()
export class CreatePostDto {
  @Field()
  @IsNotEmpty()
  @Length(2, 30)
  @IsString()
  title!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  content!: string;

  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  category!: Category;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  isOfferedPrice!: boolean;

  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  townRange!: TownRange;

  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  dealState!: DealState;

  @Field(() => [GraphQLUpload], { nullable: true })
  images?: Promise<FileUpload>[];
}
