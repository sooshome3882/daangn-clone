import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/users/guards/jwtAuth.guard';
import { User } from 'src/users/user.entity';
import { GetUser } from 'src/users/validations/getUser.decorator';
import { ReviewDto } from './dto/review.dto';
import { MannerItem } from './entities/mannerItem.entity';
import { SellerReview } from './entities/sellerReview.entity';
import { ReviewService } from './review.service';

@Resolver()
@UseGuards(JwtAuthGuard)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  // mannerItem 데이터 조회
  @Query(() => [MannerItem])
  @UsePipes(ValidationPipe)
  getMannerItemData(): Promise<MannerItem[]> {
    return this.reviewService.getMannerItemData();
  }
}
