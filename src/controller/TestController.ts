import { Controller, Get } from '@nestjs/common';
import { CarClass, CarStatus, CarType } from 'src/entity/CarType';
import { CarTypeRepository } from 'src/repository/CarTypeRepository';

@Controller('test')
export class TestController {
  constructor(private carTypeRepository: CarTypeRepository) {}

  @Get('test')
  public async test(): Promise<CarType[]> {
    return await this.carTypeRepository.findByStatus(CarStatus.ACTIVE);
  }
}
