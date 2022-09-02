import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { isCertified } from '../pipes/certified.pipe';

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
  @isCertified('isCertified')
  isCertified!: boolean;
}
