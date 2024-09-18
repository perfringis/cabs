import { Controller, Get } from '@nestjs/common';
import dayjs from 'dayjs';
import { AwardedMiles } from 'src/entity/AwardedMiles';
import { Client, ClientType, PaymentType, Type } from 'src/entity/Client';
import { AwardedMilesRepository } from 'src/repository/AwardedMilesRepository';
import { ClientRepository } from 'src/repository/ClientRepository';
import { AwardsService } from 'src/service/AwardsService';

@Controller()
export class TestController {
  constructor(
    private clientRepository: ClientRepository,
    private awardedMilesRepository: AwardedMilesRepository,
    private awardsService: AwardsService,
  ) {}

  @Get('/test')
  public async test() {
    const awardedMiles: AwardedMiles = new AwardedMiles();
    awardedMiles.setMiles(1);
    awardedMiles.setDate(dayjs().toDate());
    awardedMiles.setExpirationDate(dayjs().toDate());
    awardedMiles.setSpecial(true);

    this.awardedMilesRepository.insert(awardedMiles);
  }
}
