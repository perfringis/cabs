import { Controller, Get } from '@nestjs/common';
import { DriverFeeService } from 'src/service/DriverFeeService';

@Controller('test')
export class TestController {
  constructor(private driverFeeService: DriverFeeService) {}

  @Get('test')
  public async test(): Promise<number> {
    return await this.driverFeeService.calculateDriverFee('xd2');
  }
}
