import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { SearchPostDto } from './dto/searchPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Post } from './post.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository)
    private postRepository: PostRepository
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const insertId = await this.postRepository.createPost(createPostDto);
    return await this.getPostById(insertId);
  }

  async updatePost(postId: number, updatePostDto: UpdatePostDto): Promise<Post> {
    await this.getPostById(postId);
    await this.postRepository.updatePost(postId, updatePostDto);
    return await this.getPostById(postId);
  }

  async deletePost(postId: number): Promise<string> {
    const result = await this.postRepository.delete(postId);
    if (result.affected === 0) {
      throw new NotFoundException(`postId가 ${postId}인 것을 찾을 수 없습니다.`);
    }
    return "삭제되었습니다.";
  }

  async getPostById(postId: number): Promise<Post> {
    const found = await this.postRepository.findOne(postId);
    if (!found) {
      throw new NotFoundException(`postId가 ${postId}인 것을 찾을 수 없습니다.`);
    }
    return found;
  }

  async getPosts(searchPostDto: SearchPostDto): Promise<Post[]> {
    return this.postRepository.getPosts(searchPostDto);
  }
}
