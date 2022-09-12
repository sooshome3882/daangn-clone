import { CreatePostsComplaintsDto } from './dto/createPostsComplaints.dto';
import { AcceptOfferedPriceDto } from './dto/acceptOfferedPrice.dto';
import { ParseFilePipe, ParseIntPipe, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { SearchPostDto } from './dto/searchPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { OfferPriceDto } from './dto/offerPrice.dto';
import { Post } from './post.entity';
import { PriceOffer } from './priceOffer.entity';
import { PostService } from './post.service';
import { ComplaintReason } from 'src/complaintReasons/complaintReason.entity';
import { PostsComplaint } from './postsComplaint.entity';
import { UpdateDealStateDto } from './dto/updateDealState.dto';
import { GetUser } from 'src/users/validations/getUser.decorator';
import { JwtAuthGuard } from 'src/users/guards/jwtAuth.guard';

@Resolver(() => Post)
@UseGuards(JwtAuthGuard)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Post)
  @UsePipes(ValidationPipe)
  createPost(@GetUser() user: User, @Args('createPostDto') createPostDto: CreatePostDto) {
    return this.postService.createPost(user, createPostDto);
  }

  @Mutation(() => Post)
  updatePost(@GetUser() user: User, @Args('postId', ParseIntPipe) postId: number, @Args('updatePostDto') updatePostDto: UpdatePostDto) {
    return this.postService.updatePost(user, postId, updatePostDto);
  }

  @Mutation(() => String)
  deletePost(@GetUser() user: User, @Args('postId', ParseIntPipe) postId: number) {
    return this.postService.deletePost(user, postId);
  }

  @Query(() => Post, { name: 'post' })
  getPostById(@Args('postId', ParseIntPipe) postId: number) {
    return this.postService.getPostById(postId);
  }

  @Query(() => [Post], { name: 'posts' })
  @UsePipes(ValidationPipe)
  getPosts(@Args('searchPostDto') searchPostDto: SearchPostDto) {
    return this.postService.getPosts(searchPostDto);
  }

  // 게시글 끌올
  @Mutation(() => Post)
  @UsePipes(ValidationPipe)
  pullupPost(@Args('postId', ParseIntPipe) postId: number) {
    return this.postService.pullUpPost(postId);
  }

  // 가격 제안 to 판매자
  @Mutation(() => PriceOffer)
  @UsePipes(ValidationPipe)
  offerPriceToSeller(@Args('offerPriceDto') offerPriceDto: OfferPriceDto): Promise<PriceOffer> {
    return this.postService.offerPrice(offerPriceDto);
  }

  // 가격 제안 수락
  @Mutation(() => PriceOffer)
  @UsePipes(ValidationPipe)
  acceptOfferedPriceOfSeller(@Args('acceptOfferedPriceDto') acceptOfferPriceDto: AcceptOfferedPriceDto): Promise<PriceOffer> {
    return this.postService.acceptOfferedPrice(acceptOfferPriceDto);
  }

  // 게시글 신고
  @Mutation(() => PostsComplaint)
  @UsePipes(ValidationPipe)
  async reportPost(@Args('createPostsComplaintDto', ParseFilePipe) createPostsComplaintDto: CreatePostsComplaintsDto): Promise<PostsComplaint> {
    return await this.postService.reportPost(createPostsComplaintDto);
  }

  // 게시글 상태 변경
  @Mutation(() => Post)
  @UsePipes(ValidationPipe)
  updateDealState(@Args('postId', ParseIntPipe) postId: number, @Args('updateDealStateDto') updateDealStateDto: UpdateDealStateDto): Promise<Post> {
    return this.postService.updateDealState(postId, updateDealStateDto);
  }

  // 게시글 숨김 처리
  @Mutation(() => Post)
  @UsePipes(ValidationPipe)
  hidePost(@GetUser() user: User, @Args('postId', ParseIntPipe) postId: number) {
    return this.postService.hidePost(user, postId);
  }

  // 게시글 숨김 처리 해제
  @Mutation(() => Post)
  @UsePipes(ValidationPipe)
  async clearHiddenPostState(@GetUser() user: User, @Args('postId', ParseIntPipe) postId: number) {
    return this.postService.clearHiddenPostState(user, postId);
  }

  // 숨김처리 리스트 조회
  @Query(() => Post)
  @UsePipes(ValidationPipe)
  async getHiddenPosts(@GetUser() user: User, @Args('searchPostDto') searchPostDto: SearchPostDto) {
    return this.postService.getHiddenPostsList(user, searchPostDto);
  }

  // 특정 사용자 구매리스트 조회
  @Query(() => Post)
  @UsePipes(ValidationPipe)
  async getBuyingListsOfUser(@GetUser() user: User, @Args('searchPostDto') searchPostDto: SearchPostDto) {
    return this.postService.getBuyingListsOfUser(user, searchPostDto);
  }

  // 특정 사용자 관심목록 조회
  @Query(() => Post)
  @UsePipes(ValidationPipe)
  async getWatchListOfUser(@GetUser() user: User, @Args('searchPostDto') searchPostDto: SearchPostDto) {
    return this.postService.getWatchListOfUser(user, searchPostDto);
  }
}
