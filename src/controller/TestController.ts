import { Controller, Get } from '@nestjs/common';
import { DriverPositionDTOV2 } from 'src/dto/DriverPositionDTOV2';
import { Contract } from 'src/entity/Contract';
import { ContractRepository } from 'src/repository/ContractRepository';
import { DriverPositionRepository } from 'src/repository/DriverPositionRepository';

@Controller('test')
export class TestController {
  constructor(
    private driverPositionRepository: DriverPositionRepository,
    private contractRepository: ContractRepository,
  ) {}

  @Get('test')
  public async test() {}
}
