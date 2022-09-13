import { SearchPostDto } from './../posts/dto/searchPost.dto';
import { ParseBoolPipe, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { JoinUserDto } from './dto/joinUser.dto';
import { InputNumberValidationPipe } from './validations/inputNumber.pipe';
import { PhoneNumberValidationPipe } from './validations/phoneNumber.pipe';
import { User } from './user.entity';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { ProfileUserDto } from './dto/profile.dto';
import { ProfileInputValidationPipe } from './validations/profile.pipe';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { GetUser } from './validations/getUser.decorator';
import { Followings } from './followings.entity';
import { FollowDto } from './dto/follow.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => String)
  @UsePipes(ValidationPipe)
  join(@Args('joinUserDto') joinUserDto: JoinUserDto): Promise<string> {
    return this.userService.join(joinUserDto);
  }

  @Query(() => String)
  @UsePipes(ValidationPipe)
  login(@Args('loginUserDto') loginUserDto: LoginUserDto): Promise<string> {
    return this.userService.login(loginUserDto);
  }

  @Mutation(() => String)
  sendSMS(@Args('phoneNumber', PhoneNumberValidationPipe) phoneNumber: string): Promise<string> {
    return this.userService.sendSMS(phoneNumber);
  }

  @Query(() => String)
  checkSMS(@Args('phoneNumber', PhoneNumberValidationPipe) phoneNumber: string, @Args('inputNumber', InputNumberValidationPipe) inputNumber: string): Promise<string> {
    return this.userService.checkSMS(phoneNumber, inputNumber);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  setProfile(@GetUser('phoneNumber') phoneNumber: string, @Args('profileUserDto', ProfileInputValidationPipe) profileUserDto: ProfileUserDto): Promise<User> {
    return this.userService.setProfile(phoneNumber, profileUserDto);
  }

  @Mutation(() => User)
  @UsePipes(ValidationPipe)
  async setMarkeingInfoAgree(@GetUser('phoneNumber', PhoneNumberValidationPipe) phoneNumber: string, @Args('marketingInfoAgree', ParseBoolPipe) marketingInfoAgree: boolean): Promise<User> {
    return this.userService.setMarketingInfoAgree(phoneNumber, marketingInfoAgree);
  }

  // 팔로우
  @Mutation(() => Followings)
  @UsePipes(ValidationPipe)
  async followUsers(@GetUser() user: User, @Args('followDto') followDto: FollowDto): Promise<Followings> {
    return this.userService.followUsers(user, followDto);
  }

  // 팔로우 취소
  @Mutation(() => String)
  @UsePipes(ValidationPipe)
  async deleteFollowUsers(@Args('followingId') followingId: number): Promise<String> {
    return this.userService.deleteFollowUsers(followingId);
  }

  // 팔로잉 모아보기
  @Query(() => Followings)
  @UsePipes(ValidationPipe)
  async seeFollowUsers(@Args('searchPostDto') searchPostDto: SearchPostDto) {
    return this.userService.seeFollowUsers(searchPostDto);
  }
}
