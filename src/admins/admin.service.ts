import { Injectable } from '@nestjs/common';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  async getAdminList(): Promise<Admin[]> {
    throw new Error('Method not implemented.');
  }
}
