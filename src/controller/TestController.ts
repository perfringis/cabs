import { Controller, Get } from '@nestjs/common';
import { AwardsService } from 'src/service/AwardsService';

@Controller('test')
export class TestController {
  constructor(private awardsService: AwardsService) {}

  @Get('test')
  public test(): void {
    this.awardsService.removeMiles('client_1', 1);
  }
}
