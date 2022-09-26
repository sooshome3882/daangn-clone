import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminRepository } from './repositories/admin.repository';
import { LoginAdminDto } from './dto/loginAdmin.dto';
import * as bcrypt from 'bcrypt';
import { AdminDto } from './dto/admin.dto';
import { Admin } from './entities/admin.entity';
import { AdminAuthorityRepository } from './repositories/adminAuthority.repository';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminRepository)
    private adminRepository: AdminRepository,
    @InjectRepository(AdminAuthorityRepository)
    private adminAuthorityRepository: AdminAuthorityRepository,
    private readonly jwtService: JwtService,
  ) {}

  async loginAdmin(loginAdminDto: LoginAdminDto): Promise<string> {
    const { adminId, adminPw } = loginAdminDto;
    const found = await this.adminRepository.findOne(adminId);
    const validatePassword = await bcrypt.compare(adminPw, found.adminPw);
    if (!found || !validatePassword) {
      throw new UnauthorizedException('아이디나 패스워드가 일치하지 않습니다.');
    }
    const payload = { adminId };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  async createAdmin(adminDto: AdminDto): Promise<Admin> {
    const { adminId, adminPw, authorities } = adminDto;
    const found = await this.adminRepository.findOne(adminId);
    if (found) {
      throw new ConflictException('사용중인 아이디입니다.');
    }
    const hashedAdminPw = await bcrypt.hash(adminPw, 10);
    await this.adminRepository.createAdmin(adminId, hashedAdminPw);
    await this.adminAuthorityRepository.addAdminAuthorities(adminId, authorities);
    return await this.adminRepository.getAdminById(adminId);
  }

  async updateAdmin(adminDto: AdminDto): Promise<Admin> {
    const { adminId, adminPw, authorities } = adminDto;
    const found = await this.adminRepository.findOne(adminId);
    if (!found) {
      throw new NotFoundException('없는 아이디입니다.');
    }
    const hashedAdminPw = await bcrypt.hash(adminPw, 10);
    await this.adminRepository.updateAdmin(adminId, hashedAdminPw);
    await this.adminAuthorityRepository.deleteAdminAuthorities(adminId);
    await this.adminAuthorityRepository.addAdminAuthorities(adminId, authorities);
    return await this.adminRepository.getAdminById(adminId);
  }
}
