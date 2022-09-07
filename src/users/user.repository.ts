import { EntityRepository, getRepository, Repository } from 'typeorm';
import { User } from './user.entity';

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
}
