import { BadRequestException, PipeTransform } from '@nestjs/common';

/**
 * 인증번호 파라미터 유효성 검사 pipe
 *
 * @author 허정연(golgol22)
 * @return {value} 요청 파라미터로 전달받은 값
 * @throws {BadRequestException} 인증번호가 6자리가 아닌 경우 예외처리
 * @throws {BadRequestException} 인증번호가 숫자로만 이루어져 있지 않은 경우 예외처리
 */
export class InputNumberValidationPipe implements PipeTransform {
  transform(value: any) {
    if (value.length !== 6) throw new BadRequestException(`인증번호는 6자리입니다.`);
    if (isNaN(value)) throw new BadRequestException(`인증번호는 숫자만 입력할 수 있습니다.`);
    return value;
  }
}
