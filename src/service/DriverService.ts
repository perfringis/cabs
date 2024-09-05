import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { DriverAttributeRepository } from 'src/repository/DriverAttributeRepository';
import { DriverRepository } from 'src/repository/DriverRepository';
import { TransitRepository } from 'src/repository/TransitRepository';
import { DriverFeeService } from './DriverFeeService';
import { Driver, DriverStatus, DriverType } from 'src/entity/Driver';

@Injectable()
export class DriverService {
  private static readonly DRIVER_LICENSE_REGEX: string =
    '^[A-Z9]{5}\\d{6}[A-Z9]{2}\\d[A-Z]{2}$';

  constructor(
    private driverRepository: DriverRepository,
    private driverAttributeRepository: DriverAttributeRepository,
    private transitRepository: TransitRepository,
    private driverFeeService: DriverFeeService,
  ) {}

  private isBase64(photo: string): boolean {
    return Buffer.from(photo, 'base64').toString('base64') === photo;
  }

  public async createDriver(
    license: string,
    lastName: string,
    firstName: string,
    type: DriverType,
    status: DriverStatus,
    photo: string,
  ): Promise<Driver> {
    const driver: Driver = new Driver();

    if (status === DriverStatus.ACTIVE) {
      if (
        license === null ||
        license.length === 0 ||
        license.match(DriverService.DRIVER_LICENSE_REGEX)
      ) {
        throw new NotAcceptableException('Illegal license no = ' + license);
      }
    }

    driver.setDriverLicense(license);
    driver.setLastName(lastName);
    driver.setFirstName(firstName);
    driver.setStatus(status);
    driver.setType(type);

    if (photo !== null && !(photo.length === 0)) {
      if (this.isBase64(photo)) {
        driver.setPhoto(photo);
      } else {
        throw new NotAcceptableException('Illegal photo in base64');
      }
    }

    return await this.driverRepository.save(driver);
  }

  public async changeLicenseNumber(
    newLicense: string,
    driverId: string,
  ): Promise<void> {
    const driver: Driver = await this.driverRepository.getOne(driverId);

    if (driver === null) {
      throw new NotFoundException('Driver does not exists, id = ' + driverId);
    }

    if (
      newLicense === null ||
      newLicense.length === 0 ||
      !newLicense.match(DriverService.DRIVER_LICENSE_REGEX)
    ) {
      throw new NotAcceptableException(
        'Illegal new license no = ' + newLicense,
      );
    }

    if (!(driver.getStatus() === DriverStatus.ACTIVE)) {
      throw new NotAcceptableException(
        'Driver is not active, cannot change license',
      );
    }

    driver.setDriverLicense(newLicense);

    await this.driverRepository.save(driver);
  }

  public async changeDriverStatus(
    driverId: string,
    status: DriverStatus,
  ): Promise<void> {
    const driver: Driver = await this.driverRepository.getOne(driverId);

    if (driver === null) {
      throw new NotFoundException('Driver does not exists, id = ' + driverId);
    }

    if (status === DriverStatus.ACTIVE) {
      const license: string = driver.getDriverLicense();

      if (
        license === null ||
        license.length === 0 ||
        license.match(DriverService.DRIVER_LICENSE_REGEX)
      ) {
        throw new NotAcceptableException(
          'Status cannot be ACTIVE. Illegal license no = ' + license,
        );
      }
    }

    driver.setStatus(status);

    await this.driverRepository.save(driver);
  }

  public async changePhoto(driverId: string, photo: string): Promise<void> {
    const driver: Driver = await this.driverRepository.getOne(driverId);

    if (driver === null) {
      throw new NotFoundException('Driver does not exists, id = ' + driverId);
    }

    if (photo !== null && !(photo.length === 0)) {
      if (this.isBase64(photo)) {
        driver.setPhoto(photo);
      } else {
        throw new NotAcceptableException('Illegal photo in base64');
      }
    }

    driver.setPhoto(photo);

    await this.driverRepository.save(driver);
  }

  public async calculateDriverMonthlyPayment(
    driverId: string,
    year: number,
    month: number,
  ): Promise<number> {
    const driver: Driver = await this.driverRepository.getOne(driverId);

    if (driver === null) {
      throw new NotFoundException('Driver does not exists, id = ' + driverId);
    }

    // finish it
  }
}
