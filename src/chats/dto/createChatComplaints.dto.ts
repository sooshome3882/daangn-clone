import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Chat } from '../chat.entity';
import { ComplaintReason } from 'src/complaintReasons/complaintReason.entity';
import { ProcessState } from 'src/processStates/processState.entity';

@InputType()
export class CreateChatComplaintsDto {
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  chat!: Chat;

  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  complaintReason!: ComplaintReason;
}
