import { BadRequestException, PipeTransform } from '@nestjs/common';

/**
 * 게시글 이미지 유효성 검사 pipe
 * mimetype으로 확장자 검사를 하면 이미지 확장자가 png, jpg, jpeg아니더라도 허용하는 경우가 발생해 filename으로 확장자 검사
 *
 * @author 허정연(golgol22)
 * @return {value} 요청 파라미터로 전달받은 값
 * @throws {BadRequestException} 게시글 이미지 개수가 10를 초과하는 경우 예외처리
 * @throws {BadRequestException} 이미지 확장자가 png, jpg, jpeg가 아닌 경우 예외처리
 */
export class PostImagesValidationPipe implements PipeTransform {
  readonly imageExtensionOptions = ['png', 'jpg', 'jpeg'];
  async transform(value: any) {
    const { images } = value;
    if (images) {
      if (images.length > 10) {
        throw new BadRequestException(`게시글 이미지는 10개까지 등록이 가능합니다.`);
      }
      for (const image of images) {
        const { filename } = await image;
        if (!this.isValid(filename.split('.').slice(-1)[0])) {
          throw new BadRequestException(`이미지 확장자는 png, jpg, jpeg만 가능합니다.`);
        }
      }
    }
    return value;
  }

  private isValid(extension: string) {
    const index = this.imageExtensionOptions.indexOf(extension);
    return index !== -1;
  }
}
