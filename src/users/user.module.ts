import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import * as config from 'config';

const cacheConfig: any = config.get('cache');

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), CacheModule.register({ ttl: cacheConfig.ttl, max: cacheConfig.max })],
  providers: [UserService, UserResolver],
})
export class UserModule {}
