import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { Category } from 'src/categories/category.entity';
import { DealState } from 'src/dealStates/dealState.entity';
import { Post } from 'src/posts/post.entity';
import { TownRange } from 'src/townRanges/townRange.entity';
import { User } from 'src/users/user.entity';
import { PriceOffer } from 'src/posts/priceOffer.entity';
import { ComplaintReason } from 'src/complaintReasons/complaintReason.entity';
import { PostsComplaint } from 'src/posts/postsComplaint.entity';
import { ProcessState } from 'src/processStates/processState.entity';
import { PostsLikeRecord } from 'src/posts/postsLikeRecord.entity';
import { PostsViewRecord } from 'src/posts/postsViewRecord.entity';
import { Followings } from 'src/mypage/followings.entity';
import { PostImage } from 'src/posts/postImage.entity';
import { PurchaseHistory } from 'src/mypage/purchaseHistory.entity';

const dbConfig: any = config.get('db');

export const typeORMConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [Post, User, Category, PriceOffer, DealState, TownRange, ComplaintReason, PostsComplaint, ProcessState, PostsLikeRecord, PostsViewRecord, Followings, PostImage, PurchaseHistory],
  synchronize: dbConfig.synchronize,
  timezone: dbConfig.timezone,
};
