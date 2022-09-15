import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Followings } from './followings.entity';
import { User } from 'src/users/user.entity';
import { Post } from 'src/posts/post.entity';
import { PurchaseHistory } from './purchaseHistory.entity';
import { FollowDto } from './dto/follow.dto';
import { PurchaseHistoryDto } from './dto/purchaseHistory.dto';

@EntityRepository(Followings)
export class MypageRepository extends Repository<Followings> {
  async updateMarketingInfo(user: User, marketingInfoAgree: boolean) {
    await getRepository(User).createQueryBuilder('User').update(User).set({ marketingInfoAgree }).where('phoneNumber = :phoneNumber', { phoneNumber: user.phoneNumber }).execute();
  }

  async followUsers(user: User, followerUser: User): Promise<number> {
    const query = await getRepository(Followings).createQueryBuilder('Followings').insert().into(Followings).values({ followingUser: user, followerUser }).execute();
    return query.raw.insertId;
  }

  async deleteFollowUsers(followingId: number) {
    return await getRepository(Followings).createQueryBuilder('Followings').delete().from(Followings).where('followingId = :followingId', { followingId }).execute();
  }

  async seeFollowUsers(page: number, perPage: number) {
    return await getRepository(Followings)
      .createQueryBuilder()
      .select('followings')
      .orderBy('followings.createdAt', 'DESC')
      .offset((page - 1) * perPage)
      .limit(perPage)
      .getMany();
  }

  async getHiddenPostsList(user: User, page: number, perPage: number) {
    return await getRepository(Post)
      .createQueryBuilder()
      .select('post')
      .where('isHidden = :isHidden', { isHidden: true })
      .andWhere('reportHandling = :reportHandling', { reportHandling: false })
      .andWhere('user = :user', { user })
      .orderBy('post.createdAt', 'DESC')
      .offset((page - 1) * perPage)
      .limit(perPage)
      .getMany();
  }

  async buy(user: User, purchaseHistoryDto: PurchaseHistoryDto): Promise<number> {
    const { post } = purchaseHistoryDto;
    const query = await getRepository(PurchaseHistory).createQueryBuilder('PurchaseHistory').insert().into(PurchaseHistory).values({ user: user, post }).execute();
    return query.raw.insertId;
  }

  async getBuyingListOfUser(user: User, page: number, perPage: number): Promise<PurchaseHistory[]> {
    const queryBuilder = getRepository(PurchaseHistory)
      .createQueryBuilder('purchaseHistory')
      .innerJoinAndSelect('purchaseHistory.user', 'user')
      .innerJoinAndSelect('purchaseHistory.post', 'post')
      .where('user.phoneNumber = :userPhoneNumber', { userPhoneNumber: user.phoneNumber })
      .orderBy('purchaseHistory.createdAt', 'DESC')
      .offset((page - 1) * perPage)
      .limit(perPage);
    return queryBuilder.getMany();
  }

  async getSellingListsOfUser(user: User, page: number, perPage: number) {
    // return await getRepository(Post).createQueryBuilder().select('post').where('');
  }

  async getWatchListOfUser(user: User, page: number, perPage: number): Promise<Post[]> {
    // 🔥 수정예정
    return await getRepository(Post)
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.postsLikeRecord', 'postsLikeRecord')
      .where('postsLikeRecord.userPhoneNumber = :userPhoneNumber', { userPhoneNumber: user.phoneNumber })
      .orderBy('post.createdAt', 'DESC')
      .offset((page - 1) * perPage)
      .limit(perPage)
      .getMany();
  }
}
