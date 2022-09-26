import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';

@EntityRepository(Admin)
export class AdminRepository extends Repository<Admin> {
  async createAdmin(manager: EntityManager, adminId: string, adminPw: string) {
    await manager.createQueryBuilder().insert().into(Admin).values({ adminId, adminPw }).execute();
  }

  async updateAdmin(manager: EntityManager, adminId: string, hashedAdminPw: string) {
    await manager.createQueryBuilder().update(Admin).set({ adminPw: hashedAdminPw }).where('adminId = :adminId', { adminId }).execute();
  }

  async getAdminById(adminId: string) {
    return await this.createQueryBuilder('admin').leftJoinAndSelect('admin.authorities', 'adminId').where('admin.adminId = :adminId', { adminId }).getOne();
  }
}
