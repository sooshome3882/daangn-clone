import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseHistory } from 'src/mypage/purchaseHistory.entity';
import { User } from 'src/users/user.entity';
import { EntityManager, getConnection, getRepository } from 'typeorm';
import { ReviewDto } from './dto/review.dto';
import { BuyerReview } from './entities/buyerReview.entity';
import { MannerItem } from './entities/mannerItem.entity';
import { ScoreItem } from './entities/scoreItem.entity';
import { SelectedMannerItemToBuyer } from './entities/selectedMannerItemToBuyer.entity';
import { SelectedMannerItemToSeller } from './entities/selectedMannerItemToSeller.entity';
import { SellerReview } from './entities/sellerReview.entity';
import { ReviewRepository } from './review.repository';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewRepository)
    private reviewRepository: ReviewRepository,
  ) {}

  async getScoreItemData(): Promise<ScoreItem[]> {
    /**
     * 거래후기 작성 항목 중 ScoreItem(전체적인 거래 후기)에 대한 static data 조회
     *
     * @author 허정연(golgol22)
     * @return {ScoreItem[]} 전체적인 거래 후기 항목 목록 반환
     */
    return await getRepository(ScoreItem).find();
  }

  async getMannerItemData(): Promise<MannerItem[]> {
    /**
     * 거래후기 작성 항목 중 mannerItem(각가의 매너 항목)에 대한 static data 조회
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

  async getBuyerReviewById(buyerReviewId: number): Promise<BuyerReview> {
    /**
     * 구매자에 대한 거래후기 조회
     *
     * @author 허정연(golgol22)
     * @param {buyerReviewId} 구매자 거래후기 ID
     * @return {BuyerReview} 구매자에 대한 리뷰 반환
     */
    return await getRepository(BuyerReview).findOne(buyerReviewId);
  }

  async createSellerReview(user: User, reviewDto: ReviewDto): Promise<SellerReview> {
    /**
     * 판매자에 대한 거래후기 작성 (구매자가 작성)
     *
     * @author 허정연(golgol22)
     * @param {user, post, score, selectedMannerItems, review, retransaction}
     *        로그인한 유저, 작성한 리뷰의 게시글 ID, 전체적인 평가, 선택된 매너항목들, 후기, 재거래 희망 여부
     * @return {SellerReview} 판매자에 대한 리뷰 반환
     * @throws {NotFoundException} 구매자 정보가 등록되지 않은 게시글일 때 예외처리
     * @throws {ForbiddenException} 구매하지 않은 유저가 리뷰작성을 요청할 때 예외처리
     * @throws {BadRequestException} 이미 리뷰를 작성하였을 때 예외처리
     * @throws {InternalServerErrorException} 거래 후기 저장 실패할 때 예외처리
     */
    const { post, selectedMannerItems } = reviewDto;
    const purchase = await getRepository(PurchaseHistory).findOne({ where: { post } });
    if (!purchase) {
      throw new NotFoundException('아직 구매되지 않은 게시글입니다.');
    }
    if (JSON.stringify(purchase.user) !== JSON.stringify(user)) {
      throw new ForbiddenException('본인이 거래한 게시글에 대한 거래후기만 쓸 수 있습니다.');
    }
    const review = await getRepository(SellerReview).findOne({ where: { post } });
    if (review) {
      throw new BadRequestException('이미 리뷰를 작성하였습니다.');
    }
    let insertId = -1;
    await getConnection()
      .transaction(async (manager: EntityManager) => {
        insertId = await this.reviewRepository.createSellerReview(manager, reviewDto);
        await this.reviewRepository.setSelectedMannerItemToSeller(manager, insertId, selectedMannerItems);
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('판매자에 대한 거래 후기 작성에 실패하였습니다. 잠시후 다시 시도해주세요.');
      });
    return await this.getSellerReviewById(insertId);
  }

  async createBuyerReview(user: User, reviewDto: ReviewDto): Promise<BuyerReview> {
    /**
     * 구매자에 대한 거래후기 작성 (판매자가 작성)
     *
     * @author 허정연(golgol22)
     * @param {user, post, score, selectedMannerItems, review, retransaction}
     *        로그인한 유저, 작성한 리뷰의 게시글 ID, 전체적인 평가, 선택된 매너항목들, 후기, 재거래 희망 여부
     * @return {SellerReview} 판매자에 대한 리뷰 반환
     * @throws {NotFoundException} 구매자 정보가 등록되지 않은 게시글일 때 예외처리
     * @throws {ForbiddenException} 구매하지 않은 유저가 리뷰작성을 요청할 때 예외처리
     * @throws {BadRequestException} 이미 리뷰를 작성하였을 때 예외처리
     * @throws {InternalServerErrorException} 거래 후기 저장 실패할 때 예외처리
     */
    const { post, selectedMannerItems } = reviewDto;
    const purchase = await getRepository(PurchaseHistory).findOne({ where: { post } });
    if (!purchase) {
      throw new NotFoundException('아직 구매되지 않은 게시글입니다.');
    }
    if (JSON.stringify(purchase.post.user) !== JSON.stringify(user)) {
      throw new ForbiddenException('본인이 거래한 게시글에 대한 거래후기만 쓸 수 있습니다.');
    }
    const review = await getRepository(BuyerReview).findOne({ where: { post } });
    if (review) {
      throw new BadRequestException('이미 리뷰를 작성하였습니다.');
    }
    let insertId = -1;
    await getConnection()
      .transaction(async (manager: EntityManager) => {
        insertId = await this.reviewRepository.createBuyerReview(manager, reviewDto);
        await this.reviewRepository.setSelectedMannerItemToBuyer(manager, insertId, selectedMannerItems);
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('구매자에 대한 거래 후기 작성에 실패하였습니다. 잠시후 다시 시도해주세요.');
      });
    return await this.getBuyerReviewById(insertId);
  }

  async updateSellerReview(user: User, reviewDto: ReviewDto): Promise<SellerReview> {
    /**
     * 판매자에 대한 거래후기 수정 (구매자가 수정)
     *
     * @author 허정연(golgol22)
     * @param {user, post, score, selectedMannerItems, review, retransaction}
     *        로그인한 유저, 작성한 리뷰의 게시글 ID, 전체적인 평가, 선택된 매너항목들, 후기, 재거래 희망 여부
     * @return {SellerReview} 판매자에 대한 리뷰 반환
     * @throws {NotFoundException} 구매자 정보가 등록되지 않은 게시글일 때 예외처리
     * @throws {ForbiddenException} 로그인한 유저가 작성한 거래 후기가 아닐 때 예외처리
     * @throws {BadRequestException} 작성된 리뷰가 없을 때 예외처리
     * @throws {InternalServerErrorException} 거래 후기 수정 실패할 때 예외처리
     */
    const { post, score, selectedMannerItems, review, retransaction } = reviewDto;
    const purchase = await getRepository(PurchaseHistory).findOne({ where: { post } });
    if (!purchase) {
      throw new NotFoundException('아직 구매되지 않은 게시글입니다.');
    }
    if (JSON.stringify(purchase.user) !== JSON.stringify(user)) {
      throw new ForbiddenException('본인이 작성한 거래후기만 수정할 수 있습니다.');
    }
    const sellerReview = await getRepository(SellerReview).findOne({ where: { post } });
    if (!sellerReview) {
      throw new NotFoundException('작성된 거래후기가 없습니다.');
    }
    await getConnection()
      .transaction(async (manager: EntityManager) => {
        sellerReview.score = score;
        sellerReview.review = review;
        sellerReview.retransaction = retransaction;
        await manager.save(sellerReview);
        await getRepository(SelectedMannerItemToSeller).delete({ sellerReview: sellerReview.sellerReviewId });
        await this.reviewRepository.setSelectedMannerItemToSeller(manager, sellerReview.sellerReviewId, selectedMannerItems);
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('거래 후기 수정에 실패하였습니다. 잠시후 다시 시도해주세요.');
      });
    return await this.getSellerReviewById(sellerReview.sellerReviewId);
  }

  async updateBuyerReview(user: User, reviewDto: ReviewDto): Promise<BuyerReview> {
    /**
     * 구매자에 대한 거래후기 수정 (판매자가 수정)
     *
     * @author 허정연(golgol22)
     * @param {user, post, score, selectedMannerItems, review, retransaction}
     *        로그인한 유저, 작성한 리뷰의 게시글 ID, 전체적인 평가, 선택된 매너항목들, 후기, 재거래 희망 여부
     * @return {SellerReview} 판매자에 대한 리뷰 반환
     * @throws {NotFoundException} 구매자 정보가 등록되지 않은 게시글일 때 예외처리
     * @throws {ForbiddenException} 로그인한 유저가 작성한 거래 후기가 아닐 때 예외처리
     * @throws {BadRequestException} 작성된 리뷰가 없을 때 예외처리
     * @throws {InternalServerErrorException} 거래 후기 수정 실패할 때 예외처리
     */
    const { post, score, selectedMannerItems, review, retransaction } = reviewDto;
    const purchase = await getRepository(PurchaseHistory).findOne({ where: { post } });
    if (!purchase) {
      throw new NotFoundException('아직 구매되지 않은 게시글입니다.');
    }
    if (JSON.stringify(purchase.post.user) !== JSON.stringify(user)) {
      throw new ForbiddenException('본인이 작성한 거래후기만 수정할 수 있습니다.');
    }
    const buyerReview = await getRepository(BuyerReview).findOne({ where: { post } });
    if (!buyerReview) {
      throw new NotFoundException('작성된 거래후기가 없습니다.');
    }
    await getConnection()
      .transaction(async (manager: EntityManager) => {
        buyerReview.score = score;
        buyerReview.review = review;
        buyerReview.retransaction = retransaction;
        await manager.save(buyerReview);
        await getRepository(SelectedMannerItemToBuyer).delete({ buyerReview: buyerReview.buyerReviewId });
        await this.reviewRepository.setSelectedMannerItemToBuyer(manager, buyerReview.buyerReviewId, selectedMannerItems);
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('거래 후기 수정에 실패하였습니다. 잠시후 다시 시도해주세요.');
      });
    return await this.getBuyerReviewById(buyerReview.buyerReviewId);
  }

  async deleteSellerReview(user: User, post: number): Promise<string> {
    /**
     * 판매자에 대한 거래후기 삭제 (구매자가 삭제)
     *
     * @author 허정연(golgol22)
     * @param {user, post} 로그인한 유저, 삭제할 리뷰를 적은 판매자의 게시글 ID
     * @return {string} 거래후기가 삭제되었습니다 반환
     * @throws {NotFoundException} 구매자 정보가 등록되지 않은 게시글일 때 예외처리
     * @throws {ForbiddenException} 로그인한 유저가 작성한 거래 후기가 아닐 때 예외처리
     * @throws {InternalServerErrorException} 거래 후기 수정 실패할 때 예외처리
     */
    const purchase = await getRepository(PurchaseHistory).findOne({ where: { post } });
    if (!purchase) {
      throw new NotFoundException('아직 구매되지 않은 게시글입니다.');
    }
    if (JSON.stringify(purchase.user) !== JSON.stringify(user)) {
      throw new ForbiddenException('본인이 작성한 거래후기만 수정할 수 있습니다.');
    }
    const sellerReview = await getRepository(SellerReview).findOne({ where: { post } });
    if (!sellerReview) {
      throw new NotFoundException('작성된 거래후기가 없습니다.');
    }
    try {
      await getRepository(SellerReview).delete({ post });
      return '거래후기가 삭제되었습니다';
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('거래 후기 삭제에 실패하였습니다. 잠시후 다시 시도해주세요.');
    }
  }
}
