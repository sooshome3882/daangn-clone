import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Post } from '../post.entity';
import { ComplaintReason } from 'src/complaintReasons/complaintReason.entity';

@InputType()
export class CreatePostsComplaintsDto {
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  post!: Post;

  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  complaintReason!: ComplaintReason;
}
