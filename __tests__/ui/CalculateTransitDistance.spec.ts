import { NotAcceptableException } from '@nestjs/common';
import dayjs from 'dayjs';
import { TransitDTO } from 'src/dto/TransitDTO';
import { Address } from 'src/entity/Address';
import { Client } from 'src/entity/Client';
import { Distance } from 'src/entity/Distance';
import { Money } from 'src/entity/Money';
import { Status, Transit } from 'src/entity/Transit';

describe('CalculateTransitDistanceTest', () => {
  test('should not work with invalid unit', () => {
    expect(() => transitForDistance(2).getDistance('invalid')).toThrow(
      new NotAcceptableException('Invalid unit invalid'),
    );
  });

  test('should represent as km', () => {
    expect(transitForDistance(10).getDistance('km')).toEqual('10 km');
    expect(transitForDistance(10.123).getDistance('km')).toEqual('10.123 km');
    expect(transitForDistance(10.12345).getDistance('km')).toEqual('10.123 km');
    expect(transitForDistance(0).getDistance('km')).toEqual('0 km');
  });

  test('should represent as meters', () => {
    expect(transitForDistance(10).getDistance('m')).toEqual('10,000 m');
    expect(transitForDistance(10.123).getDistance('m')).toEqual('10,123 m');
    expect(transitForDistance(10.12345).getDistance('m')).toEqual('10,123 m');
    expect(transitForDistance(0).getDistance('m')).toEqual('0 m');
  });

  test('should represent as miles', () => {
    expect(transitForDistance(10).getDistance('miles')).toEqual('6.214 mi');
    expect(transitForDistance(10.123).getDistance('miles')).toEqual('6.29 mi');
    expect(transitForDistance(10.12345).getDistance('miles')).toEqual(
      '6.29 mi',
    );
    expect(transitForDistance(0).getDistance('miles')).toEqual('0 mi');
  });

  const transitForDistance = (km: number): TransitDTO => {
    const transit: Transit = new Transit(
      new Address('Poland', 'Warszawa', 'ul. Świętokrzyska', 20),
      new Address('Poland', 'Warszawa', 'ul. Świętokrzyska', 31),
      new Client(),
      null,
      dayjs().toDate(),
      Distance.ofKm(km),
      null,
    );

    transit.setPrice(new Money(10));

    return new TransitDTO(transit);
  };
});
