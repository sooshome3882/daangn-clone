import { BadRequestException, PipeTransform } from '@nestjs/common';

export class InputNumberValidationPipe implements PipeTransform {
  transform(value: any) {
    if (value.length !== 6) throw new BadRequestException(`인증번호는 6자리입니다.`);
    if (isNaN(value)) throw new BadRequestException(`인증번호는 숫자만 입력할 수 있습니다.`);
    return value;
  }
}
