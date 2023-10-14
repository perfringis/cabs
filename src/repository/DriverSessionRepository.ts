import { Injectable } from '@nestjs/common';
import { CarClass } from 'src/entity/CarType';
import { Driver } from 'src/entity/Driver';
import { DriverSession } from 'src/entity/DriverSession';
import { DataSource, Repository } from 'typeorm';

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
}
