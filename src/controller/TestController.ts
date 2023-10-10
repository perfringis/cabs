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
  public async test(): Promise<DriverPositionDTOV2[]> {
    const now = new Date();
    now.setFullYear(now.getFullYear() - 20);

    return await this.driverPositionRepository.findAverageDriverPositionSince(
      3.1,
      3.5,
      3.1,
      3.5,
      now,
    );
  }
}
