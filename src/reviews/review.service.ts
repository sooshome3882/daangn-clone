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
}
