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
<<<<<<< HEAD
=======
import { MyLocationDto } from './dto/mylocation.dto';
>>>>>>> 1dac3da (Feat: 내 위치에서 가까운 동네 목록 가져오기)

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [String])
  getAroundTownList(@Args('myLocationDto') myLocationDto: MyLocationDto): Promise<string[]> {
    return this.userService.getAroundTownList(myLocationDto);
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
}
