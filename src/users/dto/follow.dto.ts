import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { User } from '../user.entity';

@InputType()
export class FollowDto {
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  followers?: User;
}
