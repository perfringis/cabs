import { Driver } from 'src/entity/Driver';
import { DataSource, Repository } from 'typeorm';

export class DriverRepository extends Repository<Driver> {
  constructor(private dataSource: DataSource) {
    super(Driver, dataSource.createEntityManager());
  }

  public async getOne(driverId: string): Promise<Driver> {
    return await this.findOne({
      where: {
        id: driverId,
      },
    });
  }
}
