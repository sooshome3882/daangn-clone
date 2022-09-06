import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ProfileInputValidationPipe implements PipeTransform {
  transform(value: any) {
    const { userName, profileImage } = value;
    if (!userName && !profileImage) {
      throw new BadRequestException(`프로필 이미지나 닉네임 중 하나는 반드시 변경해야 합니다.`);
    }
    return value;
  }
}
