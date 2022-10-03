import { PostsLikeRecord } from 'src/posts/entities/postsLikeRecord.entity';
import { ParseBoolPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Followings } from './entities/followings.entity';
import { MypageService } from './mypage.service';
import { GetUser } from 'src/users/validations/getUser.decorator';
import { FollowDto } from './dto/follow.dto';
import { PurchaseHistoryDto } from './dto/purchaseHistory.dto';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';
import { PurchaseHistory } from './entities/purchaseHistory.entity';
import { JwtAuthGuard } from 'src/users/guards/jwtAuth.guard';
import { PhoneNumberValidationPipe } from 'src/users/validations/phoneNumber.pipe';
import { GetOtherProfileDto } from './dto/getOtherProfile.dto';

@Resolver()
@UseGuards(JwtAuthGuard)
export class MypageResolver {
  constructor(private readonly mypageService: MypageService) {}

  // 숨김처리 리스트 조회
  @Query(() => [Post])
  getHiddenPosts(@GetUser() user: User, @Args('page') page: number, @Args('perPage') perPage: number): Promise<Post[]> {
    return this.mypageService.getHiddenPostsList(user, page, perPage);
  }

  // 구매리스트 추가
  @Mutation(() => PurchaseHistory)
  buy(@GetUser() user: User, @Args('purchaseHistoryDto') purchaseHistoryDto: PurchaseHistoryDto): Promise<PurchaseHistory> {
    return this.mypageService.buy(user, purchaseHistoryDto);
  }

  // 특정 사용자 구매리스트 조회
  @Query(() => [PurchaseHistory])
  getBuyingListsOfUser(@GetUser() user: User, @Args('page') page: number, @Args('perPage') perPage: number): Promise<PurchaseHistory[]> {
    return this.mypageService.getBuyingListsOfUser(user, page, perPage);
  }

  // 특정 사용자 판매리스트 조회
  @Query(() => [Post])
  getSellingListOfUser(@GetUser() user: User, @Args('page') page: number, @Args('perPage') perPage: number): Promise<Post[]> {
    return this.mypageService.getSellingListOfUser(user, page, perPage);
  }

  // 특정 사용자 관심목록 조회
  @Query(() => [PostsLikeRecord])
  getWatchListOfUser(@GetUser() user: User, @Args('page') page: number, @Args('perPage') perPage: number): Promise<PostsLikeRecord[]> {
    return this.mypageService.getWatchListOfUser(user, page, perPage);
  }

  // 마켓팅 동의 여부 변경
  @Mutation(() => User)
  setMarkeingInfoAgree(@GetUser() user: User, @Args('marketingInfoAgree', ParseBoolPipe) marketingInfoAgree: boolean): Promise<User> {
    return this.mypageService.setMarketingInfoAgree(user, marketingInfoAgree);
  }

  // 팔로우
  @Mutation(() => Followings)
  followUsers(@GetUser() user: User, @Args('followDto') followDto: FollowDto): Promise<Followings> {
    return this.mypageService.followUsers(user, followDto);
  }

  // 팔로우 취소
  @Mutation(() => String)
  deleteFollowUsers(@GetUser() user: User, @Args('followingId') followingId: number): Promise<String> {
    return this.mypageService.deleteFollowUsers(user, followingId);
  }

  // 팔로잉 모아보기
  @Query(() => [Followings])
  seeFollowUsers(@GetUser() user: User, @Args('page') page: number, @Args('perPage') perPage: number): Promise<Followings[]> {
    return this.mypageService.seeFollowUsers(user, page, perPage);
  }

  // 내 프로필 조회하기
  @Query(() => User)
  getMyProfile(@GetUser() user: User, @Args('phoneNumber', PhoneNumberValidationPipe) phoneNumber: String): Promise<Object> {
    return this.mypageService.getMyProfile(user);
  }

  // 다른 유저 프로필 조회하기
  @Query(() => User)
  getOtherProfile(@Args('getOtherProfileDto') getOtherProfileDto: GetOtherProfileDto) {
    return this.mypageService.getOtherProfile(getOtherProfileDto);
  }
}
