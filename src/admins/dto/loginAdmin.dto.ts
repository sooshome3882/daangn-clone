import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LoginAdminDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  adminId!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  adminPw!: string;
}
