import { Injectable, NotFoundException } from '@nestjs/common';
import { DriverRepository } from 'src/repository/DriverRepository';
import { DriverSessionRepository } from 'src/repository/DriverSessionRepository';
import { CarTypeService } from './CarTypeService';
import { CarClass } from 'src/entity/CarType';
import { DriverSession } from 'src/entity/DriverSession';
import dayjs from 'dayjs';
import { Driver } from 'src/entity/Driver';

@Injectable()
export class DriverSessionService {
  constructor(
    private driverRepository: DriverRepository,
    private driverSessionRepository: DriverSessionRepository,
    private carTypeService: CarTypeService,
  ) {}

  public async logIn(
    driverId: string,
    plateNumber: string,
    carClass: CarClass,
    carBrand: string,
  ) {
    const session: DriverSession = new DriverSession();

    const driver: Driver = await this.driverRepository.getOne(driverId);

    session.setDriver(driver);
    session.setLoggedAt(dayjs().toDate());
    session.setCarClass(carClass);
    session.setPlatesNumber(plateNumber);
    session.setCarBrand(carBrand);

    await this.carTypeService.registerActiveCar(session.getCarClass());

    return await this.driverSessionRepository.save(session);
  }

  public async logOut(sessionId: string): Promise<void> {
    const session: DriverSession = await this.driverSessionRepository.getOne(
      sessionId,
    );

    if (session === null) {
      throw new NotFoundException('Session does not exist');
    }

    await this.carTypeService.unregisterCar(session.getCarClass());

    session.setLoggedOutAt(dayjs().toDate());

    await this.driverSessionRepository.save(session);
  }

  public async logOutCurrentSession(driverId: string): Promise<void> {
    const session: DriverSession =
      await this.driverSessionRepository.findTopByDriverAndLoggedOutAtIsNullOrderByLoggedAtDesc(
        await this.driverRepository.getOne(driverId),
      );

    if (session !== null) {
      session.setLoggedOutAt(dayjs().toDate());
      await this.carTypeService.unregisterCar(session.getCarClass());
    }

    await this.driverSessionRepository.save(session);
  }

  public async findByDriver(driverId: string): Promise<DriverSession[]> {
    return await this.driverSessionRepository.findByDriver(
      await this.driverRepository.getOne(driverId),
    );
  }
}
