import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { DriverPositionRepository } from 'src/repository/DriverPositionRepository';
import { DriverRepository } from 'src/repository/DriverRepository';
import { DistanceCalculator } from './DistanceCalculator';
import { DriverPosition } from 'src/entity/DriverPosition';
import { Driver, DriverStatus } from 'src/entity/Driver';
import dayjs from 'dayjs';

@Injectable()
export class DriverTrackingService {
  constructor(
    private driverPositionRepository: DriverPositionRepository,
    private driverRepository: DriverRepository,
    private distanceCalculator: DistanceCalculator,
  ) {}

  public async registerPosition(
    driverId: string,
    latitude: number,
    longitude: number,
  ): Promise<DriverPosition> {
    const driver: Driver = await this.driverRepository.getOne(driverId);

    if (driver === null) {
      throw new NotFoundException('Driver does not exists, id = ' + driverId);
    }

    if (driver.getStatus() !== DriverStatus.ACTIVE) {
      throw new NotAcceptableException(
        'Driver is not active, cannot register position, id = ' + driverId,
      );
    }

    const position: DriverPosition = new DriverPosition();
    position.setDriver(driver);
    position.setSeenAt(dayjs().toDate());
    position.setLatitude(latitude);
    position.setLongitude(longitude);

    return await this.driverPositionRepository.save(position);
  }

  public async calculateTravelledDistance(
    driverId: string,
    from: Date,
    to: Date,
  ): Promise<number> {
    const driver: Driver = await this.driverRepository.getOne(driverId);

    if (driver === null) {
      throw new NotFoundException('Driver does not exists, id = ' + driverId);
    }

    const positions: DriverPosition[] =
      await this.driverPositionRepository.findByDriverAndSeenAtBetweenOrderBySeenAtAsc(
        driver,
        from,
        to,
      );

    let distanceTravelled = 0;

    if (positions.length > 1) {
      let previousPosition: DriverPosition = positions[0];

      for (const position of positions.slice(1)) {
        distanceTravelled += await this.distanceCalculator.calculateByGeo(
          previousPosition.getLatitude(),
          previousPosition.getLongitude(),
          position.getLatitude(),
          position.getLongitude(),
        );

        previousPosition = position;
      }
    }

    return distanceTravelled;
  }
}
