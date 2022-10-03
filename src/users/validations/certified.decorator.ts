import { BadRequestException } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * 회원가입이나 로그인 요청시 인증여부를 점검 decorator
 *
 * @author 허정연(golgol22)
 * @return {value} 회원가입 또는 로그인 요청 파라미터로 전달받은 값
 * @throws {BadRequestException} 휴대폰 인증없이 회원가입이나 로그인을 요청할 경우 예외처리
 */
export function isCertified(property: string, validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isCertified',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any) {
          if (!value) {
            throw new BadRequestException('휴대폰인증을 해야 가입이 가능합니다.');
          }
          return value;
        },
      },
    });
  };
}
