import { ForbiddenException } from '@nestjs/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Status, Transit } from 'src/entity/Transit';
import { Money } from 'src/entity/Money';
import { Distance } from 'src/entity/Distance';

dayjs.extend(utc);

describe('CalculateTransitPriceTest', () => {
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
    expect(() => transit.estimateCost()).toThrow(
      new ForbiddenException(
        'Estimating cost for completed transit is forbidden, id = ' +
          transit.getId(),
      ),
    );
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

  test('calculate price on sunday', () => {
    // given
    const transit: Transit = _transit(Status.COMPLETED, 20);
    // and
    transitWasDoneOnSunday(transit);

    // when
    const price: Money = transit.calculateFinalCosts();

    // then
    expect(price).toEqual(new Money(38));
  });

  test('calculate price on new years eve', () => {
    // given
    const transit: Transit = _transit(Status.COMPLETED, 20);
    // and
    transitWasDoneOnNewYearsEve(transit);

    // when
    const price: Money = transit.calculateFinalCosts();

    // then
    expect(price).toEqual(new Money(81));
  });

  test('calculate price on saturday', () => {
    // given
    const transit: Transit = _transit(Status.COMPLETED, 20);
    // and
    transitWasDoneOnSaturday(transit);

    // when
    const price: Money = transit.calculateFinalCosts();

    // then
    expect(price).toEqual(new Money(38));
  });

  test('calculate price on saturday night', () => {
    // given
    const transit: Transit = _transit(Status.COMPLETED, 20);
    // and
    transitWasDoneOnSaturdayNight(transit);

    // when
    const price: Money = transit.calculateFinalCosts();

    // then
    expect(price).toEqual(new Money(60));
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
      dayjs.utc('2021-04-16 08:30', 'YYYY-MM-DD HH:mm').toDate(),
    );
  };

  const transitWasDoneOnNewYearsEve = (transit: Transit): void => {
    transit.setDateTime(
      dayjs.utc('2021-12-31 08:30', 'YYYY-MM-DD HH:mm').toDate(),
    );
  };

  const transitWasDoneOnSaturday = (transit: Transit): void => {
    transit.setDateTime(
      dayjs.utc('2021-04-17 08:30', 'YYYY-MM-DD HH:mm').toDate(),
    );
  };

  const transitWasDoneOnSunday = (transit: Transit): void => {
    transit.setDateTime(
      dayjs.utc('2021-04-18 08:30', 'YYYY-MM-DD HH:mm').toDate(),
    );
  };

  const transitWasDoneOnSaturdayNight = (transit: Transit): void => {
    transit.setDateTime(
      dayjs.utc('2021-04-17 19:30', 'YYYY-MM-DD HH:mm').toDate(),
    );
  };

  const transitWasDoneIn2018 = (transit: Transit): void => {
    transit.setDateTime(
      dayjs.utc('2021-01-01 08:30', 'YYYY-MM-DD HH:mm').toDate(),
    );
  };
});
