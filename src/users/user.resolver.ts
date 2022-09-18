import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
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
import { MyLocationDto } from './dto/mylocation.dto';
import { Location } from './location.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [String])
  getAroundTownList(@Args('myLocationDto') myLocationDto: MyLocationDto): Promise<string[]> {
    return this.userService.getAroundTownList(myLocationDto);
  }

  @Query(() => [String])
  getSearchTownList(@Args('area') area: string): Promise<string[]> {
    return this.userService.getSearchTownList(area);
  }

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

  @Query(() => [Location])
  @UseGuards(JwtAuthGuard)
  getMyTownList(@GetUser() user: User): Promise<Location[]> {
    return this.userService.getMyTownList(user);
  }

  @Mutation(() => [Location])
  @UseGuards(JwtAuthGuard)
  updateTownSelection(@GetUser() user: User, @Args('eupMyeonDong') eupMyeonDong: string): Promise<Location[]> {
    return this.userService.updateTownSelection(user, eupMyeonDong);
  }
}
