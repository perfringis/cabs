import { CarClass } from 'src/entity/CarType';
import { Driver } from 'src/entity/Driver';
import { DriverSession } from 'src/entity/DriverSession';
import { DataSource, Repository } from 'typeorm';

export class DriverSessionRepository extends Repository<DriverSession> {
  constructor(private dataSource: DataSource) {
    super(DriverSession, dataSource.createEntityManager());
  }

  // TODO finish implementation
}
