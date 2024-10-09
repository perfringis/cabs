import { NotAcceptableException } from '@nestjs/common';
import { Driver, DriverStatus, DriverType } from '../src/entity/Driver';
import { DriverService } from '../src/service/DriverService';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DriverDTO } from 'src/dto/DriverDTO';

describe('ValidateDriverLicenseIntegrationTest', () => {
  let driverService: DriverService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = await module.createNestApplication().init();

    driverService = app.get<DriverService>(DriverService);
  });

  test('cannot create active driver with invalid license', async () => {
    // expect
    await expect(
      createActiveDriverWithLicense('invalid_license'),
    ).rejects.toThrow(
      new NotAcceptableException('Illegal license no = invalid_license'),
    );
  });

  test('can create active driver with valid license', async () => {
    // when
    const driver: Driver = await createActiveDriverWithLicense(
      'FARME100165AB5EW',
    );

    // then
    const loaded: DriverDTO = await load(driver);
    expect(loaded.driverLicense).toEqual('FARME100165AB5EW');
    expect(loaded.status).toEqual(DriverStatus.ACTIVE);
  });

  test('can create inactive driver with invalid license', async () => {
    // when
    const driver: Driver = await createInactiveDriverWithLicense(
      'invalid_license',
    );

    // then
    const loaded: DriverDTO = await load(driver);
    expect(loaded.driverLicense).toEqual('invalid_license');
    expect(loaded.status).toEqual(DriverStatus.INACTIVE);
  });

  test('can change license for valid one', async () => {
    // given
    const driver: Driver = await createActiveDriverWithLicense(
      'FARME100165AB5EW',
    );

    // when
    await changeLicenseTo('99999740614992TL', driver);

    // then
    const loaded: DriverDTO = await load(driver);
    expect(loaded.driverLicense).toEqual('99999740614992TL');
  });

  test('cannot change license for invalid one', async () => {
    // given
    const driver: Driver = await createActiveDriverWithLicense(
      'FARME100165AB5EW',
    );

    // expect
    await expect(changeLicenseTo('invalid_license', driver)).rejects.toThrow(
      new NotAcceptableException('Illegal new license no = invalid_license'),
    );
  });

  test('can active driver with valid license', async () => {
    // given
    const driver: Driver = await createInactiveDriverWithLicense(
      'FARME100165AB5EW',
    );

    // when
    await active(driver);

    // then
    const loaded: DriverDTO = await load(driver);
    expect(loaded.status).toEqual(DriverStatus.ACTIVE);
  });

  test('cannot active driver with invalid license', async () => {
    // given
    const driver: Driver = await createInactiveDriverWithLicense(
      'invalid_license',
    );

    // expect
    await expect(active(driver)).rejects.toThrow(
      new NotAcceptableException(
        'Status cannot be ACTIVE. Illegal license no = invalid_license',
      ),
    );
  });

  const createActiveDriverWithLicense = async (
    license: string,
  ): Promise<Driver> => {
    return await driverService.createDriver(
      license,
      'Kowalski',
      'Jan',
      DriverType.REGULAR,
      DriverStatus.ACTIVE,
      'c3RyaW5n',
    );
  };

  const createInactiveDriverWithLicense = async (
    license: string,
  ): Promise<Driver> => {
    return await driverService.createDriver(
      license,
      'Kowalski',
      'Jan',
      DriverType.REGULAR,
      DriverStatus.INACTIVE,
      'c3RyaW5n',
    );
  };

  const load = async (driver: Driver): Promise<DriverDTO> => {
    const loaded: DriverDTO = await driverService.loadDriver(driver.getId());

    return loaded;
  };

  const changeLicenseTo = async (
    newLicense: string,
    driver: Driver,
  ): Promise<void> => {
    await driverService.changeLicenseNumber(newLicense, driver.getId());
  };

  const active = async (driver: Driver): Promise<void> => {
    await driverService.changeDriverStatus(driver.getId(), DriverStatus.ACTIVE);
  };
});
