import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { User } from 'src/users/user.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { SearchPostDto } from './dto/searchPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PullUpPostInputDto } from './dto/pullUpPostInput.dto';
import { OfferPriceDto } from './dto/offerPrice.dto';
import { AcceptOfferedPriceDto } from './dto/acceptOfferedPrice.dto';
import { Post } from './post.entity';
import { PriceOffer } from './priceOffer.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
    private connection: Connection,
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
    return '삭제되었습니다.';
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

  async pullUpPost(pullUpPostInputDto: PullUpPostInputDto) {
    /**
     * @ 코드작성자: 이승연
     * @ 기능: 게시글 끌어올리기
     * @ 1️⃣ POST 테이블을 기본적으로 updatedAt을 기준으로 (default: now() === createdAt) 정렬한다. -> 전체 조회 중 해당 사항 처리예정 (✔︎)
     * @ 2️⃣ POST 테이블에서 끌어올리고자 하는 게시글의 updatedAt을 현재 날짜로 수정한다. ()
     */
    /**
     * 1. postId로 해당 게시물 먼저 찾기
     * 2. 게시물 찾은 후 updatedAt을 현재날짜로 수정하기
     */
    const { postId } = pullUpPostInputDto;
    const found = await this.postRepository.findOne(postId);

    if (!found) {
      throw new NotFoundException(`postId가 ${postId}인 것을 찾을 수 없습니다.`);
    }

    this.postRepository.changePulled(postId);

    return this.getPostById(postId);
  }

  async offerPrice(offerPriceDto: OfferPriceDto): Promise<PriceOffer> {
    /**
     * @ 코드작성자: 이승연
     * @ 기능: 가격 제시
     * @ 부가 설명: 구매 희망자 -> 판매자 가격 제시
     * @ 1️⃣ 가격 제안 요청 to 판매자 (제안하고자 하는 가격, 판매자 PUT) ()
     * @ 2️⃣ 판매자에게 가격 제안 알림 기능 ()
     * @ 🅰️ 수락시 - isOfferedPrice = true & price = offeredPrice로 재할당 ()
     * @ 🅱️ 거절시 - nothing ()
     */

    const priceOfferedId = await this.postRepository.requestPriceToSeller(offerPriceDto);
    console.log('?????');

    // await this.postRepository.responsePriceToSeller(); // TODO - 유저 테이블 구체화된 후 수정 (알림기능)

    const priceOffer = await PriceOffer.findOne({
      where: {
        priceOfferId: priceOfferedId,
      },
    });
    console.log(priceOffer, 'here');
    return priceOffer;
  }

  async acceptOfferedPrice(acceptOfferedPriceDto: AcceptOfferedPriceDto): Promise<PriceOffer> {
    const priceOffered = await this.postRepository.determineOfferedPrice(acceptOfferedPriceDto);
    console.log(priceOffered);
    return priceOffered;
  }
}
