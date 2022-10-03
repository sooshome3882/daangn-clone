import { BadRequestException, PipeTransform } from '@nestjs/common';

/**
 * 핸드폰번호 형식 유효성 검사 pipe
 * 핸드폰 번호를 요청 파리미터로 입력받을 경우 pipe 형식으로 유효성 검사
 *
 * @author 허정연(golgol22)
 * @return {value} 요청 파라미터로 전달받은 값
 * @throws {BadRequestException} 핸드폰 번호가 010으로 시작하지 않는 경우 예외처리
 * @throws {BadRequestException} 핸드폰 번호가 11자리가 아닌 경우 예외처리
 * @throws {BadRequestException} 핸드폰 번호에 숫자가 아닌 다른 값을 포함하고 있을 경우 예외처리
 */
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
