import { NotAcceptableException } from '@nestjs/common';
import { DriverLicense } from 'src/entity/DriverLicense';

describe('DriverLicenseTest', () => {
  test('cannot create invalid license', () => {
    // expect
    expect(() => DriverLicense.withLicense('invalid_license')).toThrow(
      new NotAcceptableException('Illegal license no = invalid_license'),
    );

    expect(() => DriverLicense.withLicense('')).toThrow(
      new NotAcceptableException('Illegal license no = '),
    );
  });

  test('can create valid license', () => {
    // when
    const license: DriverLicense =
      DriverLicense.withLicense('FARME100165AB5EW');

    // then
    expect(license.asString()).toEqual('FARME100165AB5EW');
  });

  test('can create invalid license explicitly', () => {
    // when
    const license: DriverLicense =
      DriverLicense.withoutValidation('invalid_license');

    // then
    expect(license.asString()).toEqual('invalid_license');
  });
});
