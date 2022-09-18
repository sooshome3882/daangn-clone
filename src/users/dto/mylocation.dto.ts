import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MyLocationDto {
  @Field(() => Number)
  latitude!: number;

  @Field(() => Number)
  longitude!: number;

  @Field(() => Number, { nullable: true, defaultValue: 0 })
  from?: number;

  @Field(() => Number, { nullable: true, defaultValue: 20 })
  size?: number;
}
