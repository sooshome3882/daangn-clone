import { EntityRepository, Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';

@EntityRepository(Admin)
export class AdminRepository extends Repository<Admin> {
  async createAdmin(adminId: string, adminPw: string) {
    await this.createQueryBuilder('admin').insert().into(Admin).values({ adminId, adminPw }).execute();
  }

  async updateAdmin(adminId: string, hashedAdminPw: string) {
    await this.createQueryBuilder('admin').update(Admin).set({ adminPw: hashedAdminPw }).where('adminId = :adminId', { adminId }).execute();
  }

  async getAdminById(adminId: string) {
    return await this.createQueryBuilder('admin').leftJoinAndSelect('admin.authorities', 'adminId').where('admin.adminId = :adminId', { adminId }).getOne();
  }
}
