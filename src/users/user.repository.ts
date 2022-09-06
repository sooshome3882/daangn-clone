import { EntityRepository, getRepository, Repository } from 'typeorm';
import { ProfileUserDto } from './dto/profile.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async join(marketingInfoAgree: boolean, phoneNumber: string) {
    await getRepository(User).createQueryBuilder('User').insert().into(User).values({ marketingInfoAgree, phoneNumber }).execute();
  }

  async setProfile(userName: string, profileImage: string) {
    //  await getRepository(User).createQueryBuilder('User').update(User).set({ userName, profileImage }).where('phoneNumber = :phoneNumber', { phoneNumber: phoneNumber }).execute();
  }
}
