import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class LoginAdminDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(6, 10)
  adminId!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(8, 12)
  adminPw!: string;
}
