import { Controller, Get } from '@nestjs/common';
import { DriverAttributeName } from 'src/entity/DriverAttribute';
import { DriverService } from 'src/service/DriverService';

@Controller('test')
export class TestController {
  constructor(private driverService: DriverService) {}

  @Get('test')
  public async test(): Promise<void> {
    await this.driverService.addAttribute(
      'd_1',
      DriverAttributeName.EMAIL,
      'xddd',
    );
  }
}
