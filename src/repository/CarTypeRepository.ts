import { Injectable } from '@nestjs/common';
import { CarClass, CarStatus, CarType } from 'src/entity/CarType';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CarTypeRepository extends Repository<CarType> {
  constructor(private dataSource: DataSource) {
    super(CarType, dataSource.createEntityManager());
  }

  public async findByCarClass(carClass: CarClass): Promise<CarType> {
    // TODO maybe in future wil be changed
    return await this.findOne({
      where: {
        carClass,
      },
    });
  }

  public async findByStatus(status: CarStatus): Promise<CarType[]> {
    return await this.find({
      where: {
        status,
      },
    });
  }

  public async getOne(carTypeId: string): Promise<CarType> {
    return await this.findOne({
      where: {
        id: carTypeId,
      },
    });
  }

  public async deleteByEntity(carType: CarType): Promise<void> {
    await this.delete({
      id: carType.getId(),
    });
  }
}
