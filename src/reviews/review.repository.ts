import { EntityRepository, Repository } from 'typeorm';
import { SellerReview } from './entities/sellerReview.entity';

@EntityRepository(SellerReview)
export class ReviewRepository extends Repository<SellerReview> {}
