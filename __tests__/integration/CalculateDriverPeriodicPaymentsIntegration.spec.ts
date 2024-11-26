import { Test } from '@nestjs/testing';
import dayjs from 'dayjs';
import { AppModule } from 'src/app.module';
import { Driver, DriverStatus, DriverType } from 'src/entity/Driver';
import { DriverFee, FeeType } from 'src/entity/DriverFee';
import { Transit } from 'src/entity/Transit';
import { DriverFeeRepository } from 'src/repository/DriverFeeRepository';
import { TransitRepository } from 'src/repository/TransitRepository';
import { DriverService } from 'src/service/DriverService';
import utc from 'dayjs/plugin/utc';
import { Money } from 'src/entity/Money';
import { Distance } from 'src/entity/Distance';

dayjs.extend(utc);

describe('CalculateDriverPeriodicPaymentsIntegrationTest', () => {
  let transitRepository: TransitRepository;
  let feeRepository: DriverFeeRepository;
  let driverService: DriverService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = await module.createNestApplication().init();

    transitRepository = app.get<TransitRepository>(TransitRepository);
    feeRepository = app.get<DriverFeeRepository>(DriverFeeRepository);
    driverService = app.get<DriverService>(DriverService);
  });

  test('should calculate monthly payment', async () => {
    // given
    const driver: Driver = await aDriver();
    // and
    // prettier-ignore
    await Promise.all([
      aTransit(driver, 60, dayjs.utc('2000-10-01 06:30', 'YYY-MM-DD HH:mm').toDate()),
      aTransit(driver, 70, dayjs.utc('2000-10-10 02:30', 'YYY-MM-DD HH:mm').toDate()),
      aTransit(driver, 80, dayjs.utc('2000-10-30 06:30', 'YYY-MM-DD HH:mm').toDate()),
      aTransit(driver, 60, dayjs.utc('2000-11-10 01:30', 'YYY-MM-DD HH:mm').toDate()),
      aTransit(driver, 30, dayjs.utc('2000-11-10 01:30', 'YYY-MM-DD HH:mm').toDate()),
      aTransit(driver, 15, dayjs.utc('2000-12-10 02:30', 'YYY-MM-DD HH:mm').toDate()),
    ]);
    // and
    await driverHasFee(driver, FeeType.FLAT, 10);

    // when
    const feeOctober: Money = await driverService.calculateDriverMonthlyPayment(
      driver.getId(),
      2000,
      10,
    );

    // then
    expect(feeOctober).toEqual(new Money(180));

    // when
    const feeNovember: Money =
      await driverService.calculateDriverMonthlyPayment(
        driver.getId(),
        2000,
        11,
      );
    // then
    expect(feeNovember).toEqual(new Money(70));

    // when
    const feeDecember: Money =
      await driverService.calculateDriverMonthlyPayment(
        driver.getId(),
        2000,
        12,
      );
    // then
    expect(feeDecember).toEqual(new Money(5));
  });

  test('should calculate yearly payment', async () => {
    // given
    const driver: Driver = await aDriver();
    // and
    // prettier-ignore
    await Promise.all([
      aTransit(driver, 60, dayjs.utc('2000-10-01 06:30', 'YYY-MM-DD HH:mm').toDate()),
      aTransit(driver, 70, dayjs.utc('2000-10-10 02:30', 'YYY-MM-DD HH:mm').toDate()),
      aTransit(driver, 80, dayjs.utc('2000-10-30 06:30', 'YYY-MM-DD HH:mm').toDate()),
      aTransit(driver, 60, dayjs.utc('2000-11-10 01:30', 'YYY-MM-DD HH:mm').toDate()),
      aTransit(driver, 30, dayjs.utc('2000-11-10 01:30', 'YYY-MM-DD HH:mm').toDate()),
      aTransit(driver, 15, dayjs.utc('2000-12-10 02:30', 'YYY-MM-DD HH:mm').toDate()),
    ]);
    // and
    await driverHasFee(driver, FeeType.FLAT, 10);

    // when
    const payments: Map<number, Money> =
      await driverService.calculateDriverYearlyPayment(driver.getId(), 2000);

    // then
    expect(payments.get(1)).toEqual(new Money(0)); // January
    expect(payments.get(2)).toEqual(new Money(0)); // February
    expect(payments.get(3)).toEqual(new Money(0)); // March
    expect(payments.get(4)).toEqual(new Money(0)); // April
    expect(payments.get(5)).toEqual(new Money(0)); // May
    expect(payments.get(6)).toEqual(new Money(0)); // June
    expect(payments.get(7)).toEqual(new Money(0)); // July
    expect(payments.get(8)).toEqual(new Money(0)); // August
    expect(payments.get(9)).toEqual(new Money(0)); // September
    expect(payments.get(10)).toEqual(new Money(180)); // October
    expect(payments.get(11)).toEqual(new Money(70)); // November
    expect(payments.get(12)).toEqual(new Money(5)); // December
  });

  const aTransit = async (
    driver: Driver,
    price: number,
    when: Date,
  ): Promise<Transit> => {
    const transit: Transit = new Transit(
      null,
      null,
      null,
      null,
      when,
      Distance.ofKm(0),
      null,
    );

    transit.setPrice(new Money(price));
    transit.proposeTo(driver);
    transit.acceptBy(driver, dayjs().toDate());

    return await transitRepository.save(transit);
  };

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
});
