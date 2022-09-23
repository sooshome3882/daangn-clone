import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { ReviewDto } from './dto/review.dto';
import { BuyerReview } from './entities/buyerReview.entity';
import { SelectedMannerItemToBuyer } from './entities/selectedMannerItemToBuyer.entity';
import { SelectedMannerItemToSeller } from './entities/selectedMannerItemToSeller.entity';
import { SellerReview } from './entities/sellerReview.entity';

@EntityRepository(SellerReview)
export class ReviewRepository extends Repository<SellerReview> {
  async createSellerReview(manager: EntityManager, reviewDto: ReviewDto) {
    const { post, score, review, retransaction } = reviewDto;
    const query = await manager.getRepository(SellerReview).createQueryBuilder('SellerReview').insert().into(SellerReview).values({ post, score, review, retransaction }).execute();
    return query.raw.insertId;
  }

  async setSelectedMannerItemToSeller(manager: EntityManager, sellerReview: number, selectedMannerItems: number[]) {
    for (const mannerItem of selectedMannerItems)
      await manager.getRepository(SelectedMannerItemToSeller).createQueryBuilder('SelectedMannerItemToSeller').insert().into(SelectedMannerItemToSeller).values({ sellerReview, mannerItem }).execute();
  }

  async createBuyerReview(manager: EntityManager, reviewDto: ReviewDto) {
    const { post, score, review, retransaction } = reviewDto;
    const query = await manager.getRepository(BuyerReview).createQueryBuilder('BuyerReview').insert().into(BuyerReview).values({ post, score, review, retransaction }).execute();
    return query.raw.insertId;
  }

  async setSelectedMannerItemToBuyer(manager: EntityManager, buyerReview: number, selectedMannerItems: number[]) {
    for (const mannerItem of selectedMannerItems)
      await manager.getRepository(SelectedMannerItemToBuyer).createQueryBuilder('SelectedMannerItemToBuyer').insert().into(SelectedMannerItemToBuyer).values({ buyerReview, mannerItem }).execute();
  }
}
