import { Injectable } from '@nestjs/common';
import { Driver } from 'src/entity/Driver';
import { DriverFee } from 'src/entity/DriverFee';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class DriverFeeRepository extends Repository<DriverFee> {
  constructor(private dataSource: DataSource) {
    super(DriverFee, dataSource.createEntityManager());
  }

  public async findByDriver(driver: Driver): Promise<DriverFee> {
    // TODO maybe in future wil be changed
    // return this.findOne({ where: { driver } });

    return await this.findOne({
      where: {
        driver: {
          id: driver.getId(),
        },
      },
    });
  }
}
