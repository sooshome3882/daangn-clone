import { ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => String)
  @UsePipes(ValidationPipe)
  sendSMS(@Args('phoneNumber') phoneNumber: string): Promise<string> {
    return this.userService.sendSMS(phoneNumber);
  }

  @Query(() => String)
  checkSMS(@Args('phoneNumber') phoneNumber: string, @Args('inputNumber') inputNumber: string): Promise<Boolean> {
    return this.userService.checkSMS(phoneNumber, inputNumber);
  }
}
