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
import { PostComplaints } from 'src/posts/entities/postComplaints.entity';
import { PostComplaintsRepository } from 'src/posts/repositories/postComplaint.repository';
import { SearchComplaintDto } from './dto/searchComplaint.dto';
import { ChatComplaints } from 'src/chats/chatComplaints.entity';
import { ChatComplaintsRepository } from 'src/chats/repositories/chatComplaints.repository';
import { UserComplaints } from 'src/chats/userComplaints.entity';
import { UserComplaintsRepository } from 'src/chats/repositories/userComplaints.repository';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminRepository)
    private adminRepository: AdminRepository,
    @InjectRepository(AdminAuthorityRepository)
    private adminAuthorityRepository: AdminAuthorityRepository,
    @InjectRepository(PostComplaintsRepository)
    private postComplaintsRepository: PostComplaintsRepository,
    @InjectRepository(ChatComplaintsRepository)
    private chatComplaintsRepository: ChatComplaintsRepository,
    @InjectRepository(UserComplaintsRepository)
    private userComplaintsRepository: UserComplaintsRepository,
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
    const found = await this.adminRepository.findOne(adminId);
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

  async getPostComplaints(searchComplaintDto: SearchComplaintDto): Promise<PostComplaints[]> {
    /**
     * 게시글 신고목록 조회 및 검색
     *
     * @author 허정연(golgol22)
     * @param { complaintReason, processState, memo, perPage, page } 신고 이유, 처리상태, 메모, 페이지 당 보여줄 개수, 페이지
     * @return {PostComplaints[]} 게시글 신고목록
     */
    return await this.postComplaintsRepository.getPostComplaints(searchComplaintDto);
  }

  async getChatComplaints(searchComplaintDto: SearchComplaintDto): Promise<ChatComplaints[]> {
    /**
     * 채팅 신고목록 조회 및 검색
     *
     * @author 허정연(golgol22)
     * @param { complaintReason, processState, memo, perPage, page } 신고 이유, 처리상태, 메모, 페이지 당 보여줄 개수, 페이지
     * @return {ChatComplaints[]} 채팅 신고목록
     */
    return await this.chatComplaintsRepository.getChatComplaints(searchComplaintDto);
  }

  async getUserComplaints(searchComplaintDto: SearchComplaintDto): Promise<UserComplaints[]> {
    /**
     * 유저 신고목록 조회 및 검색
     *
     * @author 허정연(golgol22)
     * @param { complaintReason, processState, memo, perPage, page } 신고 이유, 처리상태, 메모, 페이지 당 보여줄 개수, 페이지
     * @return {ChatComplaints[]} 채팅 신고목록
     */
    return await this.userComplaintsRepository.getUserComplaints(searchComplaintDto);
  }
}
