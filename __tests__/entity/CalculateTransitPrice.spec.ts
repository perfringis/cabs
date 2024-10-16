import { ForbiddenException } from '@nestjs/common';
import dayjs from 'dayjs';
import { Status, Transit } from 'src/entity/Transit';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

describe('CalculateTransitPrice', () => {
  test('cannot calculate price when transit is cancelled', () => {
    // given
    const transit: Transit = _transit(Status.CANCELLED, 20);

    // expect
    expect(() => transit.calculateFinalCosts()).toThrow(
      new ForbiddenException(
        'Cannot calculate final cost if the transit is not completed',
      ),
    );
  });

  test('cannot estimate price when transit is completed', () => {
    // given
    const transit: Transit = _transit(Status.COMPLETED, 20);

    // expect
    expect(() => transit.estimateCost()).toThrow(ForbiddenException);
  });

  test('calculate price on regular day', () => {
    // given
    const transit: Transit = _transit(Status.COMPLETED, 20);

    // friday
    transitWasOnDoneOnFriday(transit);
    // when
    const price: number = transit.calculateFinalCosts();

    // then
    expect(price).toEqual(29);
  });

  test('estimate price on regular day', () => {
    // given
    const transit: Transit = _transit(Status.DRAFT, 20);

    // friday
    transitWasOnDoneOnFriday(transit);
    // when
    const price: number = transit.estimateCost();

    // then
    expect(price).toEqual(29);
  });

  const _transit = (status: Status, km: number): Transit => {
    const transit: Transit = new Transit();

    transit.setDateTime(dayjs().toDate());
    transit.setStatus(Status.DRAFT);
    transit.setKm(km);
    transit.setStatus(status);

    return transit;
  };

  const transitWasOnDoneOnFriday = (transit: Transit): void => {
    transit.setDateTime(
      dayjs.utc('16-04-2021T08:30', 'DD-MM-YYYYTHH:mm').toDate(),
    );
  };
});
