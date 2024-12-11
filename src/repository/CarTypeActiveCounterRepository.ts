import { DataSource, Repository } from 'typeorm';
import { CarClass } from '../entity/CarType';
import { Injectable } from '@nestjs/common';
import { CarTypeActiveCounter } from '../entity/CarTypeActiveCounter';

@Injectable()
export class CarTypeActiveCounterRepository extends Repository<CarTypeActiveCounter> {
  constructor(private dataSource: DataSource) {
    super(CarTypeActiveCounter, dataSource.createEntityManager());
  }

  public async findByCarClass(
    carClass: CarClass,
  ): Promise<CarTypeActiveCounter> {
    return await this.findOne({
      where: {
        carClass,
      },
    });
  }

  public async incrementCounter(carClass: CarClass) {
    return await this.increment(
      {
        carClass,
      },
      'activeCarsCounter',
      1,
    );
  }

  public async decrementCounter(carClass: CarClass) {
    return await this.decrement(
      {
        carClass,
      },
      'activeCarsCounter',
      1,
    );
  }

  public async deleteByEntity(
    carTypeActiveCounter: CarTypeActiveCounter,
  ): Promise<void> {
    await this.delete({
      carClass: carTypeActiveCounter.getCarClass(),
    });
  }
}
