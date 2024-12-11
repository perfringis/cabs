import { Injectable } from '@nestjs/common';
import { CarTypeEntityRepository } from './CarTypeEntityRepository';
import { CarTypeActiveCounterRepository } from './CarTypeActiveCounterRepository';
import { CarClass, CarStatus, CarType } from '../entity/CarType';
import { CarTypeActiveCounter } from '../entity/CarTypeActiveCounter';

@Injectable()
export class CarTypeRepository {
  constructor(
    private readonly carTypeEntityRepository: CarTypeEntityRepository,
    private readonly carTypeActiveCounterRepository: CarTypeActiveCounterRepository,
  ) {}

  public async findByCarClass(carClass: CarClass): Promise<CarType> {
    return await this.carTypeEntityRepository.findByCarClass(carClass);
  }

  public async findActiveCounter(
    carClass: CarClass,
  ): Promise<CarTypeActiveCounter> {
    return await this.carTypeActiveCounterRepository.findByCarClass(carClass);
  }

  public async findByStatus(status: CarStatus): Promise<CarType[]> {
    return await this.carTypeEntityRepository.findByStatus(status);
  }

  public async save(carType: CarType) {
    await this.carTypeActiveCounterRepository.save(
      new CarTypeActiveCounter(carType.getCarClass()),
    );

    return await this.carTypeEntityRepository.save(carType);
  }

  public async getOne(id: string): Promise<CarType> {
    return await this.carTypeEntityRepository.getOne(id);
  }

  public async deleteByEntity(carType: CarType): Promise<void> {
    await this.carTypeEntityRepository.deleteByEntity(carType);

    const carTypeActiveCounter: CarTypeActiveCounter =
      await this.carTypeActiveCounterRepository.findByCarClass(
        carType.getCarClass(),
      );
    await this.carTypeActiveCounterRepository.deleteByEntity(
      carTypeActiveCounter,
    );
  }

  public async incrementCounter(carClass: CarClass): Promise<void> {
    await this.carTypeActiveCounterRepository.incrementCounter(carClass);
  }

  public async decrementCounter(carClass: CarClass): Promise<void> {
    await this.carTypeActiveCounterRepository.decrementCounter(carClass);
  }
}
