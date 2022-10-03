import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, isNotEmpty } from 'class-validator';
import { IsPhoneNumber } from 'src/users/validations/phoneNumber.decorator';

@InputType()
export class GetOtherProfileDto {
  @Field()
  @IsNotEmpty()
  @IsPhoneNumber('isPhoneNumber')
  phoneNumber!: string;
}
