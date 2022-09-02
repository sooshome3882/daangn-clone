import { BadRequestException, PipeTransform } from '@nestjs/common';

export class PhoneNumberValidationPipe implements PipeTransform {
  transform(value: any) {
    value = value.replace(/\-/g, '');
    value = value.replace(/\./g, '');
    if (!value.startsWith('010')) throw new BadRequestException(`핸드폰 번호는 010으로 시작합니다.`);
    if (value.length !== 11) throw new BadRequestException(`핸드폰 번호는 11자리입니다.`);
    if (isNaN(value)) throw new BadRequestException(`핸드폰 번호는 숫자만 입력할 수 있습니다.`);
    return value;
  }
}
