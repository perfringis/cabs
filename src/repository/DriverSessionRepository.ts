import { Injectable } from '@nestjs/common';
import { CarClass } from 'src/entity/CarType';
import { Driver } from 'src/entity/Driver';
import { DriverSession } from 'src/entity/DriverSession';
import { DataSource, IsNull, MoreThan, Repository } from 'typeorm';

@Injectable()
export class DriverSessionRepository extends Repository<DriverSession> {
  constructor(private dataSource: DataSource) {
    super(DriverSession, dataSource.createEntityManager());
  }

  public async findAllByLoggedOutAtNullAndDriverInAndCarClassIn(
    drivers: Driver[],
    carClasses: CarClass[],
  ): Promise<DriverSession[]> {
    const driverIds: string[] = drivers.map((driver) => driver.getId());

    return await this.createQueryBuilder('driver_session')
      .where('driver_session.driver_id IN (:...driverIds)', { driverIds })
      .andWhere('driver_session.car_class IN (:...carClasses)', { carClasses })
      .andWhere('driver_session.logged_out_at IS NULL')
      .getMany();
  }

  public async findTopByDriverAndLoggedOutAtIsNullOrderByLoggedAtDesc(
    driver: Driver,
  ): Promise<DriverSession> {
    return await this.findOne({
      where: {
        driver: {
          id: driver.getId(),
        },
        loggedOutAt: IsNull(),
      },
      order: {
        loggedAt: 'DESC',
      },
    });
  }

  public async findAllByDriverAndLoggedAtAfter(
    driver: Driver,
    since: Date,
  ): Promise<DriverSession[]> {
    return await this.find({
      where: {
        driver: {
          id: driver.getId(),
        },
        loggedAt: MoreThan(since),
      },
    });
  }

  public async findByDriver(driver: Driver): Promise<DriverSession[]> {
    return await this.find({
      where: {
        driver: {
          id: driver.getId(),
        },
      },
    });
  }

  public async getOne(sessionid: string): Promise<DriverSession> {
    return await this.findOne({
      where: {
        id: sessionid,
      },
    });
  }
}
