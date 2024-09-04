import { Controller, Get } from '@nestjs/common';
import { ClientService } from 'src/service/ClientService';
import { ContractService } from 'src/service/ContractService';

@Controller('test')
export class TestController {
  constructor(
    private clientService: ClientService,
    private contractService: ContractService,
  ) {}

  @Get('test')
  public async test(): Promise<void> {
    await this.contractService.removeAttachment('xd', 'ca_1');
  }
}
