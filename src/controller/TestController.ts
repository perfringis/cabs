import { Controller, Get } from '@nestjs/common';
import { AwardsService } from 'src/service/AwardsService';

@Controller('test')
export class TestController {
  constructor(private awardsService: AwardsService) {}

  @Get('test')
  public async test(): Promise<void> {
    return await this.awardsService.activateAccount('test2');
  }
}
