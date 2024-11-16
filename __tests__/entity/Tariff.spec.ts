import { Tariff } from 'src/entity/Tariff';
import dayjs from 'dayjs';
import { Distance } from 'src/entity/Distance';
import { Money } from 'src/entity/Money';

describe('TariffTest', () => {
  test('regular tariff should be displayed and calculated', () => {
    // given
    const tariff: Tariff = Tariff.ofTime(
      dayjs('2021-04-16 08:30', 'YYYY-MM-DD HH:mm').toDate(),
    );

    // expect
    expect(tariff.calculateCost(Distance.ofKm(20))).toEqual(new Money(29));
    expect(tariff.getName()).toEqual('Standard');
    expect(tariff.getKmRate()).toEqual(1.0);
  });

  test('sunday tariff should be displayed and calculated', () => {
    // given
    const tariff: Tariff = Tariff.ofTime(
      dayjs('2021-04-18 08:30', 'YYYY-MM-DD HH:mm').toDate(),
    );

    // expect
    expect(tariff.calculateCost(Distance.ofKm(20))).toEqual(new Money(38));
    expect(tariff.getName()).toEqual('Weekend');
    expect(tariff.getKmRate()).toEqual(1.5);
  });

  test('new years eve tariff should be displayed and calculated', () => {
    // given
    const tariff: Tariff = Tariff.ofTime(
      dayjs('2021-12-31 08:30', 'YYYY-MM-DD HH:mm').toDate(),
    );

    // expect
    expect(tariff.calculateCost(Distance.ofKm(20))).toEqual(new Money(81));
    expect(tariff.getName()).toEqual('Sylwester');
    expect(tariff.getKmRate()).toEqual(3.5);
  });

  test('saturday tariff should be displayed and calculated', () => {
    // given
    const tariff: Tariff = Tariff.ofTime(
      dayjs('2021-04-17 08:30', 'YYYY-MM-DD HH:mm').toDate(),
    );

    // expect
    expect(tariff.calculateCost(Distance.ofKm(20))).toEqual(new Money(38));
    expect(tariff.getName()).toEqual('Weekend');
    expect(tariff.getKmRate()).toEqual(1.5);
  });

  test('saturday night tariff should be displayed and calculated', () => {
    // given
    const tariff: Tariff = Tariff.ofTime(
      dayjs('2021-04-17 19:30', 'YYYY-MM-DD HH:mm').toDate(),
    );

    // expect
    expect(tariff.calculateCost(Distance.ofKm(20))).toEqual(new Money(60));
    expect(tariff.getName()).toEqual('Weekend+');
    expect(tariff.getKmRate()).toEqual(2.5);
  });
});
