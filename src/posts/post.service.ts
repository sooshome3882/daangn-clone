import { PostsViewDto } from './dto/addPostsView.dto';
import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { SearchPostDto } from './dto/searchPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { OfferPriceDto } from './dto/offerPrice.dto';
import { AcceptOfferedPriceDto } from './dto/acceptOfferedPrice.dto';
import { CreatePostsComplaintsDto } from './dto/createPostsComplaints.dto';
import { Post } from './post.entity';
import { PriceOffer } from './priceOffer.entity';
import { PostRepository } from './post.repository';
import { PostsComplaint } from './postsComplaint.entity';
import { UpdateDealStateDto } from './dto/updateDealState.dto';
import { PostsLikeRecord } from './postsLikeRecord.entity';
import { PostsLikeDto } from './dto/addPostsLike.dto';
import { PostsViewRecord } from './postsViewRecord.entity';
import { v1 as uuid } from 'uuid';
import { createWriteStream } from 'fs';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
  ) {}

  async createPost(user: User, createPostDto: CreatePostDto): Promise<Post> {
    /**
     * 게시글 작성
     *
     * @author 허정연(golgol22)
     * @param {user, title, content, category, price, isOfferedPrice, townRange, dealState, images}
     *        로그인한 유저, 제목, 내용, 카테고리, 가격, 가격제안받기여부, 동네범위, 거래상태, 이미지
     * @return {Post} 게시글 반환
     * @throws {InternalServerErrorException} 이미지 저장실패할 때 예외처리
     */
    const insertId = await this.postRepository.createPost(user, createPostDto);
    const { images } = createPostDto;
    if (images) {
      for (const image of images) {
        const { createReadStream } = await image;
        const imagePath = `./src/posts/uploads/${uuid()}.png`;
        const isImageStored: boolean = await new Promise<boolean>(async (resolve, reject) =>
          createReadStream()
            .pipe(createWriteStream(imagePath))
            .on('finish', () => resolve(true))
            .on('error', () => resolve(false)),
        );
        if (!isImageStored) {
          throw new InternalServerErrorException('이미지 저장에 실패하였습니다.');
        }
        await this.postRepository.addPostImagePath(insertId, imagePath);
      }
    }
    return await this.getPostById(insertId);
  }

  async updatePost(user: User, postId: number, updatePostDto: UpdatePostDto): Promise<Post> {
    /**
     * 게시글 수정
     *
     * @author 허정연(golgol22)
     * @param {user, postId, title, content, category, price, isOfferedPrice, townRange, images}
     *        로그인한 유저, 게시글 ID, 제목, 내용, 카테고리, 가격, 가격제안받기여부, 동네범위, 이미지
     * @return {Post} 게시글 반환
     * @throws {ForbiddenException} 권한없는 사용자의 수정 요청 예외처리
     * @throws {NotFoundException} 해당 게시글이 없을 때 예외 처리
     * @throws {InternalServerErrorException} 이미지 저장실패할 때 예외처리
     */
    const post = await this.getPostById(postId);
    if (JSON.stringify(post.user) !== JSON.stringify(user)) {
      throw new ForbiddenException(`본인이 작성한 게시글만 수정할 수 있습니다.`);
    }
    if (!post) {
      throw new NotFoundException(`postId가 ${postId}인 것을 찾을 수 없습니다.`);
    }
    await this.postRepository.updatePost(postId, updatePostDto);
    await this.postRepository.deletePostImagePath(postId);
    const { images } = updatePostDto;
    if (images) {
      for (const image of images) {
        const { createReadStream } = await image;
        const imagePath = `./src/posts/uploads/${uuid()}.png`;
        const isImageStored: boolean = await new Promise<boolean>(async (resolve, reject) =>
          createReadStream()
            .pipe(createWriteStream(imagePath))
            .on('finish', () => resolve(true))
            .on('error', () => resolve(false)),
        );
        if (!isImageStored) {
          throw new InternalServerErrorException('이미지 저장에 실패하였습니다.');
        }
        await this.postRepository.addPostImagePath(postId, imagePath);
      }
    }
    return await this.getPostById(postId);
  }

  async deletePost(user: User, postId: number): Promise<string> {
    /**
     * 게시글 삭제
     *
     * @author 허정연(golgol22)
     * @param {user, postId} 로그인한 유저, 게시글 ID
     * @return {string} 삭제되었습니다.
     * @throws {ForbiddenException} 권한없는 사용자의 삭제 요청 예외처리
     * @throws {NotFoundException} 해당 게시글이 없을 때 예외 처리
     */
    const post = await this.getPostById(postId);
    if (JSON.stringify(post.user) !== JSON.stringify(user)) {
      throw new ForbiddenException(`본인이 작성한 게시글만 삭제할 수 있습니다.`);
    }
    const result = await this.postRepository.delete(postId);
    if (result.affected === 0) {
      throw new NotFoundException(`postId가 ${postId}인 것을 찾을 수 없습니다.`);
    }
    return '삭제되었습니다.';
  }

  async getPostById(postId: number): Promise<Post> {
    /**
     * 게시글 상세보기
     *
     * @author 허정연(golgol22)
     * @param {user, postId} 로그인한 유저, 게시글 ID
     * @return {Post} 게시글 반환
     * @throws {NotFoundException} 해당 게시글이 없을 때 예외 처리
     */
    const found = await this.postRepository.findOne(postId);
    if (!found) {
      throw new NotFoundException(`postId가 ${postId}인 것을 찾을 수 없습니다.`);
    }
    return found;
  }

  async getPosts(searchPostDto: SearchPostDto): Promise<Post[]> {
    /**
     * 게시글 목록 및 검색
     *
     * @author 허정연(golgol22)
     * @param {search, minPrice, maxPrice, category, townRange, dealState, perPage, page}
     *        검색어, 최소가격, 최대가격, 카테고리, 동네범위, 거래상태, 한 페이지당 게시글 개수, 페이지
     * @return {Post[]} 게시글 목록 반환
     */
    return this.postRepository.getPosts(searchPostDto);
  }

  async pullUpPost(postId: number) {
    /**
     * 게시글 끌어올리기
     *
     * @author 이승연(dltmddus1998)
     * @param {postId} 게시글 번호
     * @return {Post} 게시글 전체 반환
     * @throws {NotFoundException} 해당 게시글이 없을 때 예외 처리
     */
    const found = await this.postRepository.findOne(postId);
    if (!found) {
      throw new NotFoundException(`postId가 ${postId}인 것을 찾을 수 없습니다.`);
    }
    this.postRepository.changePulled(postId);
    return this.getPostById(postId);
  }

  async offerPrice(offerPriceDto: OfferPriceDto): Promise<PriceOffer> {
    /**
     * 가격 제안하기
     *
     * @author 이승연(dltmddus1998)
     * @param {offerPrice, post} 가격 제시, 게시글
     * @return {PriceOffer} 가격 제시 전체 반환
     */
    const priceOfferedId = await this.postRepository.requestPriceToSeller(offerPriceDto);
    // await this.postRepository.responsePriceToSeller(); // TODO - 유저 테이블 구체화된 후 수정 (알림기능)
    const priceOffer = await PriceOffer.findOne({
      where: {
        priceOfferId: priceOfferedId,
      },
    });
    return priceOffer;
  }

  async acceptOfferedPrice(acceptOfferedPriceDto: AcceptOfferedPriceDto): Promise<PriceOffer> {
    /**
     * 가격 제안 수락하기
     *
     * @author 이승연(dltmddus1998)
     * @param {accept, priceOfferId} 가격 제시 수락 여부, 가격제시 번호
     * @return {PriceOffer} 가격 제시 전체 반환
     */
    const priceOffered = await this.postRepository.determineOfferedPrice(acceptOfferedPriceDto);
    return priceOffered;
  }

  async getPostsComplaintById(complaintId: number): Promise<PostsComplaint> {
    const found = await PostsComplaint.findOne(complaintId);
    if (!found) {
      throw new NotFoundException(`postId가 ${complaintId}인 것을 찾을 수 없습니다.`);
    }
    return found;
  }

  async reportPost(createPostsComplaintDto: CreatePostsComplaintsDto): Promise<PostsComplaint> {
    /**
     * 게시글 신고하기
     *
     * @author 이승연(dltmddus1998)
     * @param {post, complaintReason, processState} 게시글, 신고 내용, 신고 처리 상태
     * @return {PostsComplaint} 게시글 신고 전체 반환
     * @throws {NotFoundException} 해당 게시글 없을 때 예외 처리
     */
    const insertId = await this.postRepository.createPostsComplaint(createPostsComplaintDto);
    return this.getPostsComplaintById(insertId);
  }

  async updateDealState(postId: number, updateDealStateDto: UpdateDealStateDto): Promise<Post> {
    /**
     * 거래 상태 변경하기
     *
     * @author 이승연(dltmddus1998)
     * @param {dealState} 거래 상태
     * @return {Post} 게시글 전체 반환
     * @throws {NotFoundException} 해당 게시글 없을 때 예외 처리
     */
    await this.postRepository.updateDealState(postId, updateDealStateDto);
    return await this.getPostById(postId);
  }

  async hidePost(user: User, postId: number) {
    /**
     * 게시글 숨김 처리하기
     *
     * @author 이승연(dltmddus1998)
     * @param {user, postId} 로그인한 유저, 게시글 번호
     * @return {Post} 게시글 전체 반환
     * @throws {NotFoundException} 해당 게시글 없을 때 예외 처리
     */
    const post = await this.getPostById(postId);
    if (JSON.stringify(post.user) !== JSON.stringify(user)) {
      throw new BadRequestException(`본인이 작성한 게시글만 숨김처리할 수 있습니다.`);
    }
    if (!post) {
      throw new NotFoundException(`postId가 ${postId}인 것을 찾을 수 없습니다.`);
    }
    await this.postRepository.updateHiddenStateTrue(postId);
    return await this.getPostById(postId);
  }

  async clearHiddenPostState(user: User, postId: number) {
    /**
     * 게시글 숨김 처리 해제하기
     *
     * @author 이승연(dltmddus1998)
     * @param {user, postId} 로그인한 유저, 게시글 번호
     * @return {Post} 게시글 전체 반환
     * @throws {NotFoundException} 해당 게시글 없을 때 예외 처리
     */
    const post = await this.getPostById(postId);
    if (JSON.stringify(post.user) !== JSON.stringify(user)) {
      throw new BadRequestException(`본인이 작성한 게시글만 숨김처리를 해제할 수 있습니다.`);
    }
    if (!post) {
      throw new NotFoundException(`postId가 ${postId}인 것을 찾을 수 없습니다.`);
    }
    await this.postRepository.updateHiddenStateFalse(postId);
    return await this.getPostById(postId);
  }

  async getPostsLikeRecordById(postsLikeId: number) {
    const found = await PostsLikeRecord.findOne(postsLikeId);
    if (!found) {
      throw new NotFoundException(`postsLikeId가 ${postsLikeId}인 기록을 찾을 수 없습니다.`);
    }
    return found;
  }

  async getPostsLikeRecordByUser(user: User, post: Post) {
    const found = await PostsLikeRecord.findOne({
      where: {
        user,
        post,
      },
    });
    return found;
  }

  async addLikeToPost(user: User, postsLikeDto: PostsLikeDto): Promise<PostsLikeRecord> {
    /**
     * 게시글 좋아요 누르기
     *
     * @author 이승연(dltmddus1998)
     * @param {user, addPostsLikeDto} 로그인한 유저, 게시글 번호
     * @return {PostsLikeRecord} 로그인한 유저가 해당 게시글에 좋아요 누른 기록 반환
     * @throws {BadRequestException} 이미 좋아요를 누른 경우 예외 처리
     */
    const { post } = postsLikeDto;
    const postsLikeReocrd = await this.getPostsLikeRecordByUser(user, post);
    if (postsLikeReocrd) {
      throw new BadRequestException(`이미 좋아요를 누른 게시물입니다.`);
    } else {
      const likeAddedPost = await Post.findOne(post);
      const likes = likeAddedPost.likes;
      const insertId = await this.postRepository.addLikeTransaction(user, postsLikeDto, post, likes);
      const updatedPostsLikeRecord = await PostsLikeRecord.findOne(insertId);
      return updatedPostsLikeRecord;
    }
  }

  async substractLikeToPost(user: User, postsLikeDto: PostsLikeDto): Promise<Post> {
    /**
     * 게시글 좋아요 취소하기
     *
     * @author 이승연(dltmddus1998)
     * @param {user, addPostsLikeDto} 로그인한 유저, 게시글 번호
     * @return {PostsLikeRecord} 해당 게시글 반환
     * @throws {BadRequestException} 좋아요를 누르지 않은 경우 예외 처리
     */
    const { post } = postsLikeDto;
    const postsLikeRecord = await this.getPostsLikeRecordByUser(user, post);
    if (!postsLikeRecord) {
      throw new BadRequestException(`해당 게시글에 좋아요를 누르지 않았습니다.`);
    } else {
      const likeSubstractedPost = await Post.findOne(post);
      const likeSubstractedPostsLikeRecord = await PostsLikeRecord.findOne({
        where: {
          post,
        },
      });
      const postsLikeId = likeSubstractedPostsLikeRecord.postsLikeId;
      const likes = likeSubstractedPost.likes;
      await this.postRepository.substractLikeTransaction(user, postsLikeId, post, likes);
      return await Post.findOne(post);
    }
  }

  async getPostsViewRecordByUser(user: User, post: Post) {
    const found = await PostsViewRecord.findOne({
      where: {
        user,
        post,
      },
    });
    return found;
  }

  async addViewToPost(user: User, postsViewDto: PostsViewDto): Promise<PostsViewRecord> {
    /**
     * 게시글 조회수 추가 (1인당 1개 Max)
     *
     * @author 이승연(dltmddus1998)
     * @param {user, addPostsViewDto} 로그인한 유저, 게시글 번호
     * @return {PostsViewRecord} 로그인한 유저가 해당 게시글을 조회한 기록 반환
     * @throws {BadRequestException} 이미 조회한 경우 예외 처리
     */
    const { post } = postsViewDto;
    const postsViewRecord = await this.getPostsViewRecordByUser(user, post);
    if (postsViewRecord) {
      throw new BadRequestException(`해당 유저가 이미 조회한 게시글입니다.`);
    } else {
      const viewAddedPost = await Post.findOne(post);
      const views = viewAddedPost.views;
      const insertId = await this.postRepository.addViewTransaction(user, postsViewDto, post, views);
      const updatedPostsViewRecord = await PostsViewRecord.findOne(insertId);
      return updatedPostsViewRecord;
    }
  }
}
