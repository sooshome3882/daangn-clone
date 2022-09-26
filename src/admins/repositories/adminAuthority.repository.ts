import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { AdminAuthority } from '../entities/adminAuthority.entity';
import { RoleType } from '../models/role.enum';

@EntityRepository(AdminAuthority)
export class AdminAuthorityRepository extends Repository<AdminAuthority> {
  async addAdminAuthorities(admin: string, authorities: RoleType[]) {
    for (const authority of authorities) await this.createQueryBuilder('AdminAuthority').insert().into(AdminAuthority).values({ admin, authority }).execute();
  }

  async deleteAdminAuthorities(adminId: string) {
    await this.createQueryBuilder('AdminAuthority').delete().from(AdminAuthority).where('adminId = :adminId', { adminId }).execute();
  }
}
