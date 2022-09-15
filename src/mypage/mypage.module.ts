import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/users/user.module';
import { MypageRepository } from './mypage.repository';
import { MypageResolver } from './mypage.resolver';
import { MypageService } from './mypage.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([MypageRepository]), UserModule],
  providers: [MypageService, MypageResolver],
})
export class MypageModule {}
