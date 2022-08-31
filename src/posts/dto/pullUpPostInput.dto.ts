import { Field, InputType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class PullUpPostInputDto {
  @Field()
  @IsNumber()
  readonly postId: number;
}
