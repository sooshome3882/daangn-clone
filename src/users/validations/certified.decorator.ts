import { BadRequestException } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';

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
