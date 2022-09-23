import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/users/guards/jwtAuth.guard';
import { User } from 'src/users/user.entity';
import { GetUser } from 'src/users/validations/getUser.decorator';
import { ReviewDto } from './dto/review.dto';
import { BuyerReview } from './entities/buyerReview.entity';
import { MannerItem } from './entities/mannerItem.entity';
import { ScoreItem } from './entities/scoreItem.entity';
import { SellerReview } from './entities/sellerReview.entity';
import { ReviewService } from './review.service';

@Resolver()
@UseGuards(JwtAuthGuard)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  // scoreItem 데이터 조회
  @Query(() => [ScoreItem])
  @UsePipes(ValidationPipe)
  getScoreItemData(): Promise<ScoreItem[]> {
    return this.reviewService.getScoreItemData();
  }

  // mannerItem 데이터 조회
  @Query(() => [MannerItem])
  @UsePipes(ValidationPipe)
  getMannerItemData(): Promise<MannerItem[]> {
    return this.reviewService.getMannerItemData();
  }

  // 판매자에 대한 리뷰 생성
  @Mutation(() => SellerReview)
  @UsePipes(ValidationPipe)
  createSellerReview(@GetUser() user: User, @Args('reviewDto') reviewDto: ReviewDto): Promise<SellerReview> {
    return this.reviewService.createSellerReview(user, reviewDto);
  }

  // 구매자에 대한 리뷰 생성
  @Mutation(() => BuyerReview)
  @UsePipes(ValidationPipe)
  createBuyerReview(@GetUser() user: User, @Args('reviewDto') reviewDto: ReviewDto): Promise<BuyerReview> {
    return this.reviewService.createBuyerReview(user, reviewDto);
  }
}
