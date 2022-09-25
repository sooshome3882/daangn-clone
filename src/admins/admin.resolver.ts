import { Args, Query, Resolver } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';

@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Query(() => [Admin])
  getAdminList(): Promise<Admin[]> {
    return this.adminService.getAdminList();
  }
}
