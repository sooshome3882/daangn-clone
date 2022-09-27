import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminRepository } from './repositories/admin.repository';
import { LoginAdminDto } from './dto/loginAdmin.dto';
import * as bcrypt from 'bcrypt';
import { AdminDto } from './dto/admin.dto';
import { Admin } from './entities/admin.entity';
import { AdminAuthorityRepository } from './repositories/adminAuthority.repository';
import { EntityManager, getConnection } from 'typeorm';
import { SearchComplaintDto } from './dto/searchComplaint.dto';
import { PostsComplaint } from 'src/posts/postsComplaint.entity';
import { UserComplaints } from 'src/chats/userComplaints.entity';
import { ChatComplaints } from 'src/chats/chatComplaints.entity';

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
    /**
     * 관리자 로그인
     *
     * @author 허정연(golgol22)
     * @param {adminId, adminPw} 관리자아이다, 관리자 패스워드
     * @return {accessToken} 로그인되었을 때 토큰 발급
     * @throws {UnauthorizedException} 일치하는 관리자 정보를 찾지 못했을 때 예외처리
     */
    const { adminId, adminPw } = loginAdminDto;
    const found = await this.adminRepository.findOne({ where: { adminId } });
    if (!found) {
      throw new UnauthorizedException('아이디나 패스워드가 일치하지 않습니다.');
    }
    const validatePassword = await bcrypt.compare(adminPw, found.adminPw);
    if (!validatePassword) {
      throw new UnauthorizedException('아이디나 패스워드가 일치하지 않습니다.');
    }
    const payload = { adminId };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  async createAdmin(adminDto: AdminDto): Promise<Admin> {
    /**
     * 관리자 계정 생성
     *
     * @author 허정연(golgol22)
     * @param {adminId, adminPw, authorities} 관리자아이다, 관리자 패스워드, 가지게 될 권한
     * @return {Admin} 생성된 관리자 계정
     * @throws {ConflictException} 생성할 아이디가 이미 사용 중일 때 예외처리
     */
    const { adminId, adminPw, authorities } = adminDto;
    const found = await this.adminRepository.findOne(adminId);
    if (found) {
      throw new ConflictException('사용중인 아이디입니다.');
    }
    const hashedAdminPw = await bcrypt.hash(adminPw, 10);
    await getConnection()
      .transaction(async (manager: EntityManager) => {
        await this.adminRepository.createAdmin(manager, adminId, hashedAdminPw);
        await this.adminAuthorityRepository.addAdminAuthorities(manager, adminId, authorities);
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('관리자 계정 생성에 실패하였습니다. 잠시후 다시 시도해주세요.');
      });
    return await this.adminRepository.getAdminById(adminId);
  }

  async updateAdmin(adminDto: AdminDto): Promise<Admin> {
    /**
     * 관리자 계정 수정
     *
     * @author 허정연(golgol22)
     * @param {adminId, adminPw, authorities} 관리자아이다, 관리자 패스워드, 가지게 될 권한
     * @return {Admin} 수정된 관리자 계정
     * @throws {NotFoundException} 수정하려고 하는 계정이 없는 아이디일 때 예외처리
     */
    const { adminId, adminPw, authorities } = adminDto;
    const found = await this.adminRepository.findOne(adminId);
    if (!found) {
      throw new NotFoundException('없는 아이디입니다.');
    }
    const hashedAdminPw = await bcrypt.hash(adminPw, 10);
    await getConnection()
      .transaction(async (manager: EntityManager) => {
        await this.adminRepository.updateAdmin(manager, adminId, hashedAdminPw);
        await this.adminAuthorityRepository.deleteAdminAuthorities(manager, adminId);
        await this.adminAuthorityRepository.addAdminAuthorities(manager, adminId, authorities);
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('관리자 계정 수정에 실패하였습니다. 잠시후 다시 시도해주세요.');
      });
    return await this.adminRepository.getAdminById(adminId);
  }

  async getComplaints(searchComplatinDto: SearchComplaintDto): Promise<UserComplaints | ChatComplaints | PostsComplaint> {
    throw new Error('Method not implemented.');
  }
}
