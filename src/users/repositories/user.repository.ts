import { InternalServerErrorException } from '@nestjs/common';
import { EntityManager, EntityRepository, getConnection, getRepository, Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async join(manager: EntityManager, marketingInfoAgree: boolean, phoneNumber: string) {
    await manager.getRepository(User).createQueryBuilder('User').insert().into(User).values({ marketingInfoAgree, phoneNumber }).execute();
  }

  async setProfileUserName(manager: EntityManager, phoneNumber: string, userName: string) {
    await manager.getRepository(User).createQueryBuilder('User').update(User).set({ userName }).where('phoneNumber = :phoneNumber', { phoneNumber }).execute();
  }

  async setProfileImage(manager: EntityManager, phoneNumber: string, profileImage: string) {
    await manager.getRepository(User).createQueryBuilder('User').update(User).set({ profileImage }).where('phoneNumber = :phoneNumber', { phoneNumber }).execute();
  }
}
