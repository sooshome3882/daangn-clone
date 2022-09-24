import { BadRequestException, PipeTransform } from '@nestjs/common';
import { getRepository, Like } from 'typeorm';
import { MannerItem } from '../entities/mannerItem.entity';

/**
 * 리뷰 입력값 유효성 검사 pipe
 *
 * @author 허정연(golgol22)
 * @return {value} 요청 파라미터로 전달받은 값
 * @throws {BadRequestException} 매너 항목을 하나도 선택하지 않았을 때 예외처리
 * @throws {BadRequestException} 최고예요(1), 좋아요(2)에 해당하는 매너항목이 아닐 때 예외처리
 * @throws {BadRequestException} 별로예요(3)에 해당하는 매너항목이 아닐 때 예외처리
 */
export class ReviewInputValidationPipe implements PipeTransform {
  async transform(value: any) {
    const mannerItemOptionsByScore12 = (await getRepository(MannerItem).find({ mannerItemId: Like('a%') })).map((mannerItem: MannerItem) => mannerItem.mannerItemId);
    const mannerItemOptionsByScore3 = (await getRepository(MannerItem).find({ mannerItemId: Like('b%') })).map((mannerItem: MannerItem) => mannerItem.mannerItemId);

    const { score, selectedMannerItems } = value;
    if (selectedMannerItems.length === 0) {
      throw new BadRequestException(`매너 항목은 하나이상 선택해야 합니다.`);
    }
    if (score === 1 || score === 2) {
      const isVaild = selectedMannerItems.filter((x: any) => mannerItemOptionsByScore12.includes(x));
      if (isVaild.length !== selectedMannerItems.length) {
        throw new BadRequestException(`전체 거래 평가에 해당하는 매너 항목이 아닙니다.`);
      }
    }
    if (score === 3) {
      const isVaild = selectedMannerItems.filter((x: any) => mannerItemOptionsByScore3.includes(x));
      if (isVaild.length !== selectedMannerItems.length) {
        throw new BadRequestException(`전체 거래 평가에 해당하는 매너 항목이 아닙니다.`);
      }
    }
    return value;
  }
}
