import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { Post } from '../post.entity';
import { ComplaintReason } from 'src/complaintReasons/complaintReason.entity';
import { ProcessState } from 'src/processStates/processState.entity';

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

  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  processState!: ProcessState;

  //   @Field()
  //   @IsNotEmpty()
  //   @IsString()
  //   complaintUserId!: number;
}
