import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import * as config from 'config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwtAuth.guard';

const cacheConfig: any = config.get('cache');
const jwtConfig: any = config.get('jwt');
const passportConfig: any = config.get('passport');

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: passportConfig.defaultStrategy,
      session: false,
    }),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    CacheModule.register({ ttl: cacheConfig.ttl, max: cacheConfig.max }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [UserService, UserResolver, JwtStrategy, JwtAuthGuard],
  exports: [JwtStrategy, PassportModule, JwtAuthGuard],
})
export class UserModule {}
