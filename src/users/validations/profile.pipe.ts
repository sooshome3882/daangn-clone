import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ProfileInputValidationPipe implements PipeTransform {
  readonly imageExtensionOptions = ['png', 'jpg', 'jpeg'];
  async transform(value: any) {
    const { userName, profileImage } = value;
    if (!userName && !profileImage) {
      throw new BadRequestException(`프로필 이미지나 닉네임 중 하나는 반드시 변경해야 합니다.`);
    }
    if (userName) {
      if (userName.length < 2 || userName.length > 10) {
        throw new BadRequestException(`이름은 2-10글자만 설정이 가능합니다.`);
      }
    }

    if (profileImage) {
      const { filename } = await profileImage;
      if (!this.isValid(filename.split('.').slice(-1)[0])) {
        throw new BadRequestException(`이미지 확장자는 png, jpg, jpeg만 가능합니다.`);
      }
    }
    return value;
  }

  private isValid(extension: string) {
    const index = this.imageExtensionOptions.indexOf(extension);
    return index !== -1;
  }
}
