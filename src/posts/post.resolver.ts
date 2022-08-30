import { ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { SearchPostDto } from './dto/searchPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Post } from './post.entity';
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

  @Query(() => Post, {name: 'post'})
  getPostById(@Args('postId', ParseIntPipe) postId: number) {
    return this.postService.getPostById(postId);
  }

  @Query(() => [Post], {name: 'posts'})
  @UsePipes(ValidationPipe)
  getPosts(@Args('searchPostDto') searchPostDto: SearchPostDto) {
    console.log(searchPostDto);
    return this.postService.getPosts(searchPostDto);
  }
}