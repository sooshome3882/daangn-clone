import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../user.repository';
import * as config from 'config';
import { User } from '../user.entity';
import { Payload } from '../models/payload.model';

const jwtConfig: any = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload): Promise<User> {
    const { phoneNumber } = payload;
    const user: User = await this.userRepository.findOne({ where: { phoneNumber: phoneNumber } });
    if (!user) {
      throw new UnauthorizedException('user를 찾을 수 없습니다.');
    }
    return user;
  }
}
