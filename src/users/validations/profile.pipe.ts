import { BadRequestException, PipeTransform } from '@nestjs/common';

/**
 * 프로필 설정 유효성 검사 pipe
 * mimetype으로 확장자 검사를 하면 이미지 확장자가 png, jpg, jpeg아니더라도 허용하는 경우가 발생해 filename으로 확장자 검사
 *
 * @author 허정연(golgol22)
 * @return {value} 요청 파라미터로 전달받은 값
 * @throws {BadRequestException} 이미지나 닉네임 중 하나도 요청하지 않은 경우 예외처리
 * @throws {BadRequestException} 닉네임이 2-10글자가 아닌 경우 예외처리
 * @throws {BadRequestException} 이미지 확장자가 png, jpg, jpeg가 아닌 경우 예외처리
 */
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
