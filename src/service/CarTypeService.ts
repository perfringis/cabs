import { Injectable, NotFoundException } from '@nestjs/common';
import { AppProperties } from 'src/config/AppProperties';
import { CarTypeDTO } from 'src/dto/CarTypeDTO';
import { CarClass, CarStatus, CarType } from 'src/entity/CarType';
import { CarTypeRepository } from 'src/repository/CarTypeRepository';

@Injectable()
export class CarTypeService {
  constructor(
    private carTypeRepository: CarTypeRepository,
    private appProperties: AppProperties,
  ) {}

  public async load(carTypeId: string): Promise<CarType> {
    const carType: CarType = await this.carTypeRepository.getOne(carTypeId);

    if (carType === null) {
      throw new NotFoundException('Cannot find car type');
    }

    return carType;
  }

  public async loadDto(carTypeId: string): Promise<CarTypeDTO> {
    return new CarTypeDTO(await this.load(carTypeId));
  }

  public async create(carTypeDTO: CarTypeDTO): Promise<CarType> {
    const byCarClass: CarType = await this.carTypeRepository.findByCarClass(
      carTypeDTO.getCarClass(),
    );

    if (byCarClass === null) {
      const type: CarType = new CarType(
        carTypeDTO.getCarClass(),
        carTypeDTO.getDescription(),
        this.getMinNumberOfCars(carTypeDTO.getCarClass()),
      );

      return await this.carTypeRepository.save(type);
    } else {
      byCarClass.setDescription(carTypeDTO.getDescription());

      return await this.carTypeRepository.save(byCarClass);
    }
  }

  public async activate(carTypeId: string): Promise<void> {
    const carType: CarType = await this.load(carTypeId);
    carType.activate();

    await this.carTypeRepository.save(carType);
  }

  public async deactivate(carTypeId: string): Promise<void> {
    const carType: CarType = await this.load(carTypeId);
    carType.deactivate();

    await this.carTypeRepository.save(carType);
  }

  public async registerCar(carClass: CarClass): Promise<void> {
    const carType: CarType = await this.findByCarClass(carClass);
    carType.registerCar();

    await this.carTypeRepository.save(carType);
  }

  public async unregisterCar(carClass: CarClass): Promise<void> {
    const carType: CarType = await this.findByCarClass(carClass);
    carType.unregisterCar();

    await this.carTypeRepository.save(carType);
  }

  public async unregisterActiveCar(carClass: CarClass): Promise<void> {
    const carType: CarType = await this.findByCarClass(carClass);
    carType.unregisterActiveCar();

    await this.carTypeRepository.save(carType);
  }

  public async registerActiveCar(carClass: CarClass): Promise<void> {
    const carType: CarType = await this.findByCarClass(carClass);
    carType.registerActiveCar();

    await this.carTypeRepository.save(carType);
  }

  public async findActiveCarClasses(): Promise<CarClass[]> {
    return (await this.carTypeRepository.findByStatus(CarStatus.ACTIVE)).map(
      (carType: CarType) => {
        return carType.getCarClass();
      },
    );
  }

  private getMinNumberOfCars(carClass: CarClass): number {
    if (carClass === CarClass.ECO) {
      return this.appProperties.getMinNoOfCarsForEcoClass();
    } else {
      return 10;
    }
  }

  public async removeCarType(carClass: CarClass): Promise<void> {
    const carType: CarType = await this.carTypeRepository.findByCarClass(
      carClass,
    );
    if (carType !== null) {
      await this.carTypeRepository.deleteByEntity(carType);
    }
  }

  private async findByCarClass(carClass: CarClass): Promise<CarType> {
    const byCarClass: CarType = await this.carTypeRepository.findByCarClass(
      carClass,
    );

    if (byCarClass === null) {
      throw new NotFoundException('Car class does not exist: ' + carClass);
    }

    return byCarClass;
  }
}
