import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { isCertified } from '../validations/certified.decorator';
import { IsPhoneNumber } from '../validations/phoneNumber.decorator';

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
  @IsPhoneNumber('isPhoneNumber')
  phoneNumber!: string;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  @isCertified('isCertified')
  isCertified!: boolean;
}
