import { Test } from '@nestjs/testing';
import dayjs from 'dayjs';
import { AppModule } from 'src/app.module';
import { Driver, DriverStatus, DriverType } from 'src/entity/Driver';
import { DriverFee, FeeType } from 'src/entity/DriverFee';
import { Transit } from 'src/entity/Transit';
import { DriverFeeRepository } from 'src/repository/DriverFeeRepository';
import { TransitRepository } from 'src/repository/TransitRepository';
import { DriverFeeService } from 'src/service/DriverFeeService';
import { DriverService } from 'src/service/DriverService';
import utc from 'dayjs/plugin/utc';
import { Money } from 'src/entity/Money';
import { Distance } from 'src/entity/Distance';

dayjs.extend(utc);

describe('CalculateDriverFreeIntegrationTest', () => {
  let driverFeeService: DriverFeeService;
  let feeRepository: DriverFeeRepository;
  let transitRepository: TransitRepository;
  let driverService: DriverService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = await module.createNestApplication().init();

    driverFeeService = app.get<DriverFeeService>(DriverFeeService);
    feeRepository = app.get<DriverFeeRepository>(DriverFeeRepository);
    transitRepository = app.get<TransitRepository>(TransitRepository);
    driverService = app.get<DriverService>(DriverService);
  });

  test('should calculate drivers flat fee', async () => {
    // given
    const driver: Driver = await aDriver();
    // and
    const transit: Transit = await aTransit(driver, 60, null);
    // and
    await driverHasFee(driver, FeeType.FLAT, 10);

    // when
    const fee: Money = await driverFeeService.calculateDriverFee(
      transit.getId(),
    );

    // then
    expect(fee).toEqual(new Money(50));
  });

  test('should calculate drivers percentage fee', async () => {
    // given
    const driver: Driver = await aDriver();
    // and
    const transit: Transit = await aTransit(driver, 80, null);
    // and
    await driverHasFee(driver, FeeType.PERCENTAGE, 50);

    // when
    const fee: Money = await driverFeeService.calculateDriverFee(
      transit.getId(),
    );

    // then
    expect(fee).toEqual(new Money(40));
  });

  test('should use minimum fee', async () => {
    // given
    const driver: Driver = await aDriver();
    // and
    const transit: Transit = await aTransit(driver, 10, null);
    // and
    await _driverHasFee(driver, FeeType.PERCENTAGE, 7, 5);

    // when
    const fee: Money = await driverFeeService.calculateDriverFee(
      transit.getId(),
    );

    // then
    expect(fee).toEqual(new Money(5));
  });

  const _driverHasFee = async (
    driver: Driver,
    feeType: FeeType,
    amount: number,
    min: number,
  ): Promise<DriverFee> => {
    const driverFee: DriverFee = new DriverFee(feeType, driver, amount, min);
    return await feeRepository.save(driverFee);
  };

  const driverHasFee = async (
    driver: Driver,
    feeType: FeeType,
    amount: number,
  ): Promise<DriverFee> => {
    return await _driverHasFee(driver, feeType, amount, 0);
  };

  const aDriver = async () => {
    return await driverService.createDriver(
      'FARME100165AB5EW',
      'Kowalski',
      'Janusz',
      DriverType.REGULAR,
      DriverStatus.ACTIVE,
      '',
    );
  };

  const aTransit = async (
    driver: Driver,
    price: number,
    when: Date = dayjs().toDate(),
  ): Promise<Transit> => {
    const transit: Transit = new Transit(
      null,
      null,
      null,
      null,
      dayjs.utc(when).toDate(),
      Distance.ZERO,
      null,
    );

    // INFO: It has to be initialized in that way bcs of TypeORM
    transit.driversRejections = new Array<Driver>();
    transit.proposedDrivers = new Array<Driver>();

    transit.setPrice(new Money(price));
    transit.proposeTo(driver);

    const now = dayjs().toDate();
    transit.acceptBy(driver, now);

    return await transitRepository.save(transit);
  };
});
