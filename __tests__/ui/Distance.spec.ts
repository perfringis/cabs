import { NotAcceptableException } from '@nestjs/common';
import { Distance } from 'src/entity/Distance';

describe('DistanceTest', () => {
  test('cannot understand invalid unit', () => {
    expect(() => Distance.ofKm(2000).printIn('invalid')).toThrow(
      new NotAcceptableException('Invalid unit invalid'),
    );
  });

  test('can convert to float', () => {
    expect(Distance.ofKm(2000).toKmInFloat()).toEqual(2000);
    expect(Distance.ZERO.toKmInFloat()).toEqual(0);
    expect(Distance.ofKm(312.22).toKmInFloat()).toEqual(312.22);
    expect(Distance.ofKm(2).toKmInFloat()).toEqual(2);
  });

  test('can represent distance as meters', () => {
    expect(Distance.ofKm(2000).printIn('m')).toEqual('2,000,000 m');
    expect(Distance.ZERO.printIn('m')).toEqual('0 m');
    expect(Distance.ofKm(312.22).printIn('m')).toEqual('312,220 m');
    expect(Distance.ofKm(2).printIn('m')).toEqual('2,000 m');
  });

  test('can represent distance as km', () => {
    expect(Distance.ofKm(2000).printIn('km')).toEqual('2,000 km');
    expect(Distance.ZERO.printIn('km')).toEqual('0 km');
    expect(Distance.ofKm(312.22).printIn('km')).toEqual('312.22 km');
    expect(Distance.ofKm(312.221111232313).printIn('km')).toEqual('312.221 km');
    expect(Distance.ofKm(2).printIn('km')).toEqual('2 km');
  });

  test('can represent distance as miles', () => {
    expect(Distance.ofKm(2000).printIn('miles')).toEqual('1,242.742 mi');
    expect(Distance.ZERO.printIn('miles')).toEqual('0 mi');
    expect(Distance.ofKm(312.22).printIn('miles')).toEqual('194.005 mi');
    expect(Distance.ofKm(312.221111232313).printIn('miles')).toEqual(
      '194.005 mi',
    );
    expect(Distance.ofKm(2).printIn('miles')).toEqual('1.243 mi');
  });
});
