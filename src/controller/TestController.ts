import { Controller, Get } from '@nestjs/common';
import { ClaimDTO } from 'src/dto/ClaimDTO';
import { Claim, ClaimStatus } from 'src/entity/Claim';
import { AwardsService } from 'src/service/AwardsService';
import { CarTypeService } from 'src/service/CarTypeService';
import { ClaimNumberGenerator } from 'src/service/ClaimNumberGenerator';
import { ClaimService } from 'src/service/ClaimService';

@Controller('test')
export class TestController {
  constructor(
    private awardsService: AwardsService,
    private carTypeService: CarTypeService,
    private claimNumberGenerator: ClaimNumberGenerator,
    private claimService: ClaimService,
  ) {}

  @Get('test')
  public async test(): Promise<Claim> {
    return await this.claimService.tryToResolveAutomatically('claim_2');
  }
}
