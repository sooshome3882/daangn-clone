import {
  BadRequestException,
  CacheInterceptor,
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UserRepository } from './user.repository';
import axios from 'axios';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import * as config from 'config';
import { SMS } from './models/sms.model';
import { JoinUserDto } from './dto/joinUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { ProfileUserDto } from './dto/profile.dto';
import { createWriteStream } from 'fs';
import { v1 as uuid } from 'uuid';
import { MyLocationDto } from './dto/mylocation.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { getRepository } from 'typeorm';
import { Location } from './location.entity';

const smsConfig: any = config.get('sms');
const ACCESS_KEY_ID = smsConfig.access_key_id;
const SECRET_KEY = smsConfig.secret_key;
const SERVICE_ID = smsConfig.service_id;
const FROM = smsConfig.from;

@Injectable()
@UseInterceptors(CacheInterceptor)
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly esService: ElasticsearchService,
  ) {}

  async getAroundTownList(myLocationDto: MyLocationDto): Promise<string[]> {
    const { latitude, longitude, from, size } = myLocationDto;
    const result = await this.esService.search({
      index: 'coordinate',
      body: {
        sort: [
          {
            _geo_distance: {
              location: {
                lat: latitude,
                lon: longitude,
              },
              order: 'asc',
              unit: 'm',
            },
          },
        ],
      },
      _source: ['시도', '시군구', '읍면동'],
      from: from,
      size: size,
    });
    const aroundTownList = [];
    const hits = result.hits.hits;
    if (hits.length === 0) {
      throw new NotFoundException('검색결과가 없어요. 위치를 다시 설정해주세요!');
    }
    hits.map(item => {
      aroundTownList.push(`${item._source['시도']} ${item._source['시군구']} ${item._source['읍면동']}`);
    });
    return aroundTownList;
  }

  async getSearchTownList(area: string): Promise<string[]> {
    const result = await this.esService.search({
      index: 'coordinate',
      body: {
        query: {
          query_string: {
            fields: ['시도', '시군구', '읍면동'],
            query: `*${area}*`,
          },
        },
      },
      _source: ['시도', '시군구', '읍면동'],
      size: 100,
    });
    const searchTownList = [];
    const hits = result.hits.hits;
    if (hits.length === 0) {
      throw new NotFoundException('검색결과가 없어요. 동네이름을 다시 확인해주세요!');
    }
    hits.map(item => {
      searchTownList.push(`${item._source['시도']} ${item._source['시군구']} ${item._source['읍면동']}`);
    });
    return searchTownList;
  }

  async join(joinUserDto: JoinUserDto): Promise<string> {
    const { area, marketingInfoAgree, phoneNumber } = joinUserDto;
    const found = await this.getUserByPhoneNumber({ phoneNumber });
    if (!found) {
      const [siDo, siGunGu, eupMyeonDong] = area.split(' ');
      if (!(siDo && siGunGu && eupMyeonDong)) {
        throw new BadRequestException('지역 형식이 올바르지 않습니다.');
      }
      const result = await this.esService.search({
        index: 'coordinate',
        body: {
          query: {
            bool: {
              must: [
                {
                  match: {
                    '시도.keyword': siDo,
                  },
                },
                {
                  match: {
                    '시군구.keyword': siGunGu,
                  },
                },
                {
                  match: {
                    '읍면동.keyword': eupMyeonDong,
                  },
                },
              ],
            },
          },
        },
        _source: ['시도', '시군구', '읍면동'],
      });
      const hits = result.hits.hits;
      if (hits.length === 0) {
        throw new BadRequestException('지역 형식이 올바르지 않습니다.');
      }
      await this.userRepository.joinTransaction(marketingInfoAgree, phoneNumber, siDo, siGunGu, eupMyeonDong);
    }
    const payload = { phoneNumber };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const phoneNumber = loginUserDto.phoneNumber;
    const found = await this.getUserByPhoneNumber({ phoneNumber });
    if (!found) {
      throw new UnauthorizedException('회원가입을 해주세요');
    }
    const payload = { phoneNumber };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  async getUserByPhoneNumber({ phoneNumber }: { phoneNumber: string }): Promise<User> {
    return await this.userRepository.findOne({ where: { phoneNumber } });
  }

  async getUserById(userId: number): Promise<User> {
    const found = await this.userRepository.findOne(userId);
    if (!found) {
      throw new NotFoundException(`userId ${userId}인 것을 찾을 수 없습니다.`);
    }
    return found;
  }

  makeSignitureForSMS(): string {
    const message = [];
    const hmac = crypto.createHmac('sha256', SECRET_KEY);
    const timeStamp = Date.now().toString();
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    message.push(method);
    message.push(space);
    message.push(`/sms/v2/services/${SERVICE_ID}/messages`);
    message.push(newLine);
    message.push(timeStamp);
    message.push(newLine);
    message.push(ACCESS_KEY_ID);
    const signiture = hmac.update(message.join('')).digest('base64');
    return signiture.toString();
  }

  makeRand6Num(): number {
    return Math.floor(Math.random() * 1000000);
  }

  async sendSMS(phoneNumber: string): Promise<string> {
    await this.cacheManager.del(phoneNumber);
    const checkNumber = this.makeRand6Num().toString().padStart(6, '0');
    const body: SMS = {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: FROM,
      content: `인증번호는 [${checkNumber}] 입니다.`,
      messages: [
        {
          to: phoneNumber,
        },
      ],
    };
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-apigw-timestamp': Date.now().toString(),
      'x-ncp-iam-access-key': ACCESS_KEY_ID,
      'x-ncp-apigw-signature-v2': this.makeSignitureForSMS(),
    };
    try {
      const result = await axios.post(`https://sens.apigw.ntruss.com/sms/v2/services/${SERVICE_ID}/messages`, body, { headers });
      if (result.status === 202) {
        await this.cacheManager.set(phoneNumber, checkNumber);
        return checkNumber;
      }
    } catch (err) {
      console.log(err.response.data);
      throw new InternalServerErrorException('인증 메시지를 보내는데 실패하였습니다.');
    }
  }

  async checkSMS(phoneNumber: string, inputNumber: string): Promise<string> {
    const storedNumber = (await this.cacheManager.get(phoneNumber)) as string;
    if (storedNumber === inputNumber) return '인증이 완료되었습니다.';
    return '인증번호가 올바르지않습니다.';
  }

  async setProfile(phoneNumber: string, profileUserDto: ProfileUserDto): Promise<User> {
    const { userName, profileImage } = profileUserDto;
    if (userName) {
      const found = await this.userRepository.findOne({ where: { userName } });
      if (found) {
        throw new ConflictException(`${userName}은 이미 사용중인 이름입니다.`);
      }
      await this.userRepository.setProfileUserName(phoneNumber, userName);
    }
    const user = await this.userRepository.findOne(phoneNumber);
    if (user.userName === null) {
      throw new ConflictException(`처음 이름은 꼭 설정해야 합니다.`);
    }

    if (profileImage) {
      const { createReadStream } = await profileImage;
      const newFileName = uuid();
      const isImageStored: boolean = await new Promise<boolean>(async (resolve, reject) =>
        createReadStream()
          .pipe(createWriteStream(`./src/users/uploads/${newFileName}.png`))
          .on('finish', () => resolve(true))
          .on('error', () => resolve(false)),
      );
      if (!isImageStored) {
        throw new InternalServerErrorException('이미지 저장에 실패하였습니다.');
      }
      await this.userRepository.setProfileImage(phoneNumber, `./src/users/uploads/${newFileName}.png`);
    }
    return await this.getUserByPhoneNumber({ phoneNumber });
  }

  async getMyTownList(user: User): Promise<Location[]> {
    return await getRepository(Location).find({ where: { user: user.phoneNumber } });
  }
}
