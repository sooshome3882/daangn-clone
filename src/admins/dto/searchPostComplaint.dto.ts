import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, Min } from 'class-validator';
import { ComplaintReason } from 'src/complaintReasons/complaintReason.entity';
import { ProcessState } from 'src/processStates/processState.entity';

@InputType()
export class SearchPostComplaintDto {
  @Field(() => Number, { nullable: true })
  complaintReason?: ComplaintReason;

  @Field(() => Number, { nullable: true })
  processState?: ProcessState;

  @Field(() => String, { nullable: true })
  memo?: string;

  @Field({ nullable: true, defaultValue: 10 })
  @IsNumber()
  @Min(1)
  perPage?: number;

  @Field({ nullable: true, defaultValue: 1 })
  @IsNumber()
  @Min(1)
  page?: number;
}
