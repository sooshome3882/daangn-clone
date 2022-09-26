import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { RoleType } from '../models/role.enum';

@InputType()
export class AdminDto {
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

  @Field(() => [String])
  @IsNotEmpty()
  @IsString()
  authorities!: RoleType[];
}
