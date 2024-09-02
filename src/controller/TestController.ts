import { Controller, Get } from '@nestjs/common';
import { Claim } from 'src/entity/Claim';
import { AwardsService } from 'src/service/AwardsService';
import { CarTypeService } from 'src/service/CarTypeService';
import { ClaimNumberGenerator } from 'src/service/ClaimNumberGenerator';

@Controller('test')
export class TestController {
  constructor(
    private awardsService: AwardsService,
    private carTypeService: CarTypeService,
    private claimNumberGenerator: ClaimNumberGenerator,
  ) {}

  @Get('test')
  public async test(): Promise<string> {
    return await this.claimNumberGenerator.generate(new Claim());
  }
}
