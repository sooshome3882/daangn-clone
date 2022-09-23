import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';
import { GetUser } from 'src/users/validations/getUser.decorator';
import { CreateSellerReviewDto } from './dto/createSellerReview.dto';
import { SellerReview } from './entities/sellerReview.entity';
import { ReviewService } from './review.service';

@Resolver()
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Mutation(() => SellerReview)
  @UsePipes(ValidationPipe)
  createSellerReview(@GetUser() user: User, @Args('createSellerReviewDto') createSellerReviewDto: CreateSellerReviewDto) {}
}
