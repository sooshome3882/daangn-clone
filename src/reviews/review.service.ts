import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseHistory } from 'src/mypage/purchaseHistory.entity';
import { User } from 'src/users/user.entity';
import { EntityManager, getConnection, getRepository } from 'typeorm';
import { ReviewDto } from './dto/review.dto';
import { MannerItem } from './entities/mannerItem.entity';
import { SellerReview } from './entities/sellerReview.entity';
import { ReviewRepository } from './review.repository';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewRepository)
    private reviewRepository: ReviewRepository,
  ) {}

  async getMannerItemData(): Promise<MannerItem[]> {
    /**
     * 거래후기 작성 항목 중 mannerItem에 대한 static data 조회
     *
     * @author 허정연(golgol22)
     * @return {MannerItem[]} 매너항목 목록 반환
     */
    return await getRepository(MannerItem).find();
  }

  async getSellerReviewById(sellerReviewId: number): Promise<SellerReview> {
    /**
     * 판매자에 대한 거래후기 조회
     *
     * @author 허정연(golgol22)
     * @param {sellerReviewId} 판매자 거래후기 ID
     * @return {SellerReview} 판매자에 대한 리뷰 반환
     */
    return await getRepository(SellerReview).findOne(sellerReviewId);
  }

  async createSellerReview(user: User, reviewDto: ReviewDto): Promise<SellerReview> {
    /**
     * 판매자에 대한 거래후기 작성
     *
     * @author 허정연(golgol22)
     * @param {user, postId, score, selectedMannerItems, review, retransaction}
     *        로그인한 유저, 작성한 리뷰의 게시글 ID, 전체적인 평가, 선택된 매너항목들, 후기, 재거래 희망 여부
     * @return {SellerReview} 판매자에 대한 리뷰 반환
     * @throws {BadRequestException} 구매자 정보가 등록되지 않은 게시글일 때 예외처리
     * @throws {ForbiddenException} 구매하지 않은 유저가 리뷰작성을 요청할 때 예외처리
     * @throws {BadRequestException} 이미 리뷰를 작성하였을 때 예외처리
     */
    const { post, selectedMannerItems } = reviewDto;
    const buyer = await getRepository(PurchaseHistory).findOne({ where: { post } });
    if (!buyer) {
      throw new BadRequestException('아직 구매되지 않은 게시글입니다.');
    }
    if (JSON.stringify(buyer.user) !== JSON.stringify(user)) {
      throw new ForbiddenException('구매한 게시글에 대한 거래후기만 쓸 수 있습니다.');
    }
    const review = await getRepository(SellerReview).findOne({ where: { post } });
    if (review) {
      throw new BadRequestException('이미 리뷰를 작성하였습니다.');
    }
    let insertId = -1;
    await getConnection()
      .transaction(async (manager: EntityManager) => {
        insertId = await this.reviewRepository.createSellerReview(manager, reviewDto);
        await this.reviewRepository.setSelectedMannerItem(manager, insertId, selectedMannerItems);
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('판매자에 대한 거래 후기 작성에 실패하였습니다. 잠시후 다시 시도해주세요.');
      });
    return this.getSellerReviewById(insertId);
  }
}
