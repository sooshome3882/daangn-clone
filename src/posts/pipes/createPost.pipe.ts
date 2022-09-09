import { BadRequestException, PipeTransform } from '@nestjs/common';

export class CreatePostValidationPipe implements PipeTransform {
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
