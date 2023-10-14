import { Controller, Get } from '@nestjs/common';
import { CarClass } from 'src/entity/CarType';
import { Driver, DriverStatus } from 'src/entity/Driver';
import { DriverSession } from 'src/entity/DriverSession';
import { DriverSessionRepository } from 'src/repository/DriverSessionRepository';

@Controller('test')
export class TestController {
  constructor(private driverSessionRepository: DriverSessionRepository) {}

  @Get('test')
  public async test(): Promise<> {}
}
