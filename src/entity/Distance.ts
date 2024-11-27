import { NotAcceptableException } from '@nestjs/common';
import objectHash from 'object-hash';

export class Distance {
  private static readonly MILES_TO_KILOMETERS_RATIO = 1.609344;
  public static readonly ZERO = Distance.ofKm(0);

  private km: number;

  private constructor(km: number) {
    this.km = km;
  }

  public static ofKm(km: number): Distance {
    return new Distance(km);
  }

  public toKmInFloat() {
    return this.km;
  }

  public hashCode(): string {
    return objectHash({ km: this.km });
  }

  public printIn(unit: string) {
    if (unit === 'km') {
      if (this.km === Math.ceil(this.km)) {
        return new Intl.NumberFormat('en-US', {
          style: 'unit',
          unit: 'kilometer',
        }).format(Math.round(this.km));
      }
      return new Intl.NumberFormat('en-US', {
        style: 'unit',
        unit: 'kilometer',
      }).format(this.km);
    }

    if (unit === 'miles') {
      const distance = this.km / Distance.MILES_TO_KILOMETERS_RATIO;
      if (distance === Math.ceil(distance)) {
        return new Intl.NumberFormat('en-US', {
          style: 'unit',
          unit: 'mile',
        }).format(Math.round(distance));
      }
      return new Intl.NumberFormat('en-US', {
        style: 'unit',
        unit: 'mile',
      }).format(distance);
    }

    if (unit === 'm') {
      return new Intl.NumberFormat('en-US', {
        style: 'unit',
        unit: 'meter',
      }).format(Math.round(this.km * 1000));
    }

    throw new NotAcceptableException('Invalid unit ' + unit);
  }
}
