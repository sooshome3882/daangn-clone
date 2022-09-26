import { EntityManager, EntityRepository, getRepository, Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { AdminAuthority } from '../entities/adminAuthority.entity';
import { RoleType } from '../models/role.enum';

@EntityRepository(AdminAuthority)
export class AdminAuthorityRepository extends Repository<AdminAuthority> {
  async addAdminAuthorities(manager: EntityManager, admin: string, authorities: RoleType[]) {
    for (const authority of authorities) await manager.createQueryBuilder().insert().into(AdminAuthority).values({ admin, authority }).execute();
  }

  async deleteAdminAuthorities(manager: EntityManager, adminId: string) {
    await manager.createQueryBuilder().delete().from(AdminAuthority).where('adminId = :adminId', { adminId }).execute();
  }
}
