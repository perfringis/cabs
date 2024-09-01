import { Controller, Get } from '@nestjs/common';
import { CarClass } from 'src/entity/CarType';
import { AwardsService } from 'src/service/AwardsService';
import { CarTypeService } from 'src/service/CarTypeService';

@Controller('test')
export class TestController {
  constructor(
    private awardsService: AwardsService,
    private carTypeService: CarTypeService,
  ) {}

  @Get('test')
  public async test(): Promise<void> {
    await this.carTypeService.removeCarType(CarClass.ECO);
  }
}
