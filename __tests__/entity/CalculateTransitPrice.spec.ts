import { ForbiddenException } from '@nestjs/common';
import dayjs from 'dayjs';
import { Status, Transit } from 'src/entity/Transit';
import utc from 'dayjs/plugin/utc';
import { Money } from 'src/entity/Money';
import { Distance } from 'src/entity/Distance';

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
    const price: Money = transit.calculateFinalCosts();

    // then
    expect(price).toEqual(new Money(29));
  });

  test('estimate price on regular day', () => {
    // given
    const transit: Transit = _transit(Status.DRAFT, 20);

    // friday
    transitWasOnDoneOnFriday(transit);

    // when
    const price: Money = transit.estimateCost();

    // then
    expect(price).toEqual(new Money(29));
  });

  const _transit = (status: Status, km: number): Transit => {
    const transit: Transit = new Transit();

    transit.setDateTime(dayjs().toDate());
    transit.setStatus(Status.DRAFT);
    transit.setKm(Distance.ofKm(km));
    transit.setStatus(status);

    return transit;
  };

  const transitWasOnDoneOnFriday = (transit: Transit): void => {
    transit.setDateTime(
      dayjs.utc('16-04-2021 08:30', 'DD-MM-YYYY HH:mm').toDate(),
    );
  };
});
