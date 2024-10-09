import { NotAcceptableException } from '@nestjs/common';
import { Column } from 'typeorm';

export class DriverLicense {
  private static readonly DRIVER_LICENSE_REGEX: string =
    '^[A-Z9]{5}\\d{6}[A-Z9]{2}\\d[A-Z]{2}$';

  @Column({
    name: 'driver_license',
    nullable: false,
    type: 'varchar',
    length: 255,
  })
  private license: string;

  constructor(license: string) {
    this.license = license;
  }

  public static withLicense(license: string): DriverLicense {
    if (
      license === null ||
      license.length === 0 ||
      !license.match(DriverLicense.DRIVER_LICENSE_REGEX)
    ) {
      throw new NotAcceptableException('Illegal license no = ' + license);
    }
    return new DriverLicense(license);
  }

  public static withoutValidation(license: string): DriverLicense {
    return new DriverLicense(license);
  }

  public asString(): string {
    return this.license;
  }
}
