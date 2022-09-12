import { EntityRepository, getRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { FollowDto } from './dto/follow.dto';
import { Followings } from './followings.entity';
import { SearchPostDto } from 'src/posts/dto/searchPost.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async join(marketingInfoAgree: boolean, phoneNumber: string) {
    await getRepository(User).createQueryBuilder('User').insert().into(User).values({ marketingInfoAgree, phoneNumber }).execute();
  }

  async setProfileUserName(phoneNumber: string, userName: string) {
    await getRepository(User).createQueryBuilder('User').update(User).set({ userName }).where('phoneNumber = :phoneNumber', { phoneNumber: phoneNumber }).execute();
  }

  async setProfileImage(phoneNumber: string, profileImage: string) {
    await getRepository(User).createQueryBuilder('User').update(User).set({ profileImage }).where('phoneNumber = :phoneNumber', { phoneNumber: phoneNumber }).execute();
  }

  async updateMarketingInfo(phoneNumber: string, marketingInfoAgree: boolean) {
    await getRepository(User).createQueryBuilder('User').update(User).set({ marketingInfoAgree }).where('phoneNumber = :phoneNumber', { phoneNumber }).execute();
  }

  async followUsers(user: User, followDto: FollowDto) {
    const { followers } = followDto;
    const query = await getRepository(Followings).createQueryBuilder('Followings').insert().into(Followings).values({ followingUser: user, followerUser: followers }).execute();
    return query.raw.insertId;
  }

  async deleteFollowUsers(followingId: number) {
    return await getRepository(Followings).createQueryBuilder('Followings').delete().from(Followings).where('followingId = :followingId', { followingId }).execute();
  }

  async seeFollowUsers(searchPostDto: SearchPostDto) {
    const { perPage, page } = searchPostDto;
    return await getRepository(Followings)
      .createQueryBuilder()
      .select('followings')
      .orderBy('followings.createdAt', 'DESC')
      .offset((page - 1) * perPage)
      .limit(perPage)
      .getMany();
  }
}
