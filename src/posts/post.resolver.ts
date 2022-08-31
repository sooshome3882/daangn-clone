import { AcceptOfferedPriceDto } from './dto/acceptOfferedPrice.dto';
import { ParseBoolPipe, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { SearchPostDto } from './dto/searchPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
// import { PullUpPostInputDto } from './dto/pullUpPostInput.dto';
import { OfferPriceDto } from './dto/offerPrice.dto';
import { Post } from './post.entity';
import { PriceOffer } from './priceOffer.entity';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Post)
  @UsePipes(ValidationPipe)
  createPost(@Args('createPostDto') createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Mutation(() => Post)
  @UsePipes(ValidationPipe)
  updatePost(@Args('postId', ParseIntPipe) postId: number, @Args('updatePostDto') updatePostDto: UpdatePostDto) {
    return this.postService.updatePost(postId, updatePostDto);
  }

  @Mutation(() => String)
  deletePost(@Args('postId', ParseIntPipe) postId: number) {
    return this.postService.deletePost(postId);
  }

  @Query(() => Post, { name: 'post' })
  getPostById(@Args('postId', ParseIntPipe) postId: number) {
    return this.postService.getPostById(postId);
  }

  @Query(() => [Post], { name: 'posts' })
  @UsePipes(ValidationPipe)
  getPosts(@Args('searchPostDto') searchPostDto: SearchPostDto) {
    console.log(searchPostDto);
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

  // 게시글 숨김 처리
  @Mutation(() => Post)
  @UsePipes(ValidationPipe)
  hidePost(@Args('postId', ParseIntPipe) postId: number) {
    return this.postService.hidePost(postId);
  }
}
