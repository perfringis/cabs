import { Controller, Get } from '@nestjs/common';
import { ClientService } from 'src/service/ClientService';
import { ContractService } from 'src/service/ContractService';
import { DistanceCalculator } from 'src/service/DistanceCalculator';

@Controller('test')
export class TestController {
  constructor(
    private clientService: ClientService,
    private contractService: ContractService,
    private distanceCalculator: DistanceCalculator,
  ) {}

  @Get('test')
  public async test() {
    return this.distanceCalculator.calculateByGeo(100, 50, 100, 20);
  }
}
