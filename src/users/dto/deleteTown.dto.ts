import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class DeleteTownDto {
  @Field()
  @IsNotEmpty()
  deleteDupMyeonDong!: string;

  @Field({ nullable: true })
  addArea?: string;
}
