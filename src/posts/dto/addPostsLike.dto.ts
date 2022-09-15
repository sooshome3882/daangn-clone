import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Post } from '../post.entity';

@InputType()
export class PostsLikeDto {
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  post!: Post;
}
