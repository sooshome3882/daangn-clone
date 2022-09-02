import { CacheModule, CACHE_MANAGER, Module, Options } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), CacheModule.register({ ttl: 600, max: 1000 })],
  providers: [UserService, UserResolver],
})
export class UserModule {}
