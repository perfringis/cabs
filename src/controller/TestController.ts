import { Controller, Get } from '@nestjs/common';
import { AwardedMiles } from 'src/entity/AwardedMiles';
import { AwardsService } from 'src/service/AwardsService';

@Controller('test')
export class TestController {
  constructor(private awardsService: AwardsService) {}

  @Get('test')
  public async test(): Promise<AwardedMiles> {
    return await this.awardsService.registerMiles('test1', 'xddd1');
  }
}
