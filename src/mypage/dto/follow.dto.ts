import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/user.entity';

@InputType()
export class FollowDto {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  followerUser!: User;
}
