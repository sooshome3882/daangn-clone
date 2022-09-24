import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, Length } from 'class-validator';
import { Post } from 'src/posts/post.entity';
import { MannerItem } from '../entities/mannerItem.entity';
import { ScoreItem } from '../entities/scoreItem.entity';

@InputType()
export class ReviewDto {
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  post!: Post;

  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  score!: ScoreItem;

  @Field(() => [Number])
  @IsNotEmpty()
  selectedMannerItems!: MannerItem[];

  @Field(() => String)
  @Length(2, 255)
  review!: string;

  @Field(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  retransaction!: boolean;
}
