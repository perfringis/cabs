import { Controller, Get } from '@nestjs/common';
import dayjs from 'dayjs';
import { DriverTrackingService } from 'src/service/DriverTrackingService';

@Controller('test')
export class TestController {
  constructor(private driverTrackingService: DriverTrackingService) {}

  @Get('test')
  public async test(): Promise<number> {
    return await this.driverTrackingService.calculateTravelledDistance(
      'd_1',
      dayjs().subtract(10, 'day').toDate(),
      dayjs().add(10, 'day').toDate(),
    );
  }
}
