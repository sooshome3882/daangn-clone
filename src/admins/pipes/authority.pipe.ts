import { BadRequestException, PipeTransform } from '@nestjs/common';
import { RoleType } from '../models/role.enum';

/**
 * 권한 입력값 유효성 검사 pipe
 *
 * @author 허정연(golgol22)
 * @return {value} 요청 파라미터로 전달받은 값
 * @throws {BadRequestException} 권한 항목을 하나도 선택하지 않았을 때 예외처리
 * @throws {BadRequestException} 지정할 수 없는 권한을 포함하고 있을 때 예외처리
 */
export class AuthorityInputValidationPipe implements PipeTransform {
  readonly roleOptions = [RoleType.ACCOUNT_CREATE, RoleType.ACCOUNT_UPDATE, RoleType.READ, RoleType.WRITE];
  async transform(value: any) {
    const { authorities } = value;
    if (authorities.length === 0) {
      throw new BadRequestException(`권한 항목은 하나이상 선택해야 합니다.`);
    }
    const upperAuthorities = authorities.map((authority: string) => authority.toUpperCase());
    const isValid = upperAuthorities.filter((x: any) => this.roleOptions.includes(x));
    if (isValid.length !== authorities.length) {
      throw new BadRequestException('지정할 수 없는 권한이 포함되어있습니다..');
    }
    return value;
  }
}
