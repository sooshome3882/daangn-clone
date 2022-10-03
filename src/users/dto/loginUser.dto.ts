import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { isCertified } from '../validations/certified.decorator';
import { IsPhoneNumber } from '../validations/phoneNumber.decorator';

@InputType()
export class LoginUserDto {
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
