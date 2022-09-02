import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, IS_PHONE_NUMBER, Length } from 'class-validator';

@InputType()
export class JoinUserDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  area!: string;

  @Field()
  @IsNotEmpty()
  marketingInfoAgree!: boolean;

  @Field()
  @IsNotEmpty()
  phoneNumber!: string;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  isCertified!: boolean;
}
