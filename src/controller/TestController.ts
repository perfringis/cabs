import { Controller, Get } from '@nestjs/common';
import { AwardedMiles } from 'src/entity/AwardedMiles';
import { Client } from 'src/entity/Client';
import { AwardedMilesRepository } from 'src/repository/AwardedMilesRepository';

@Controller('test')
export class TestController {
  constructor(private awardedMilesRepository: AwardedMilesRepository) {}

  @Get('test')
  public async test(): Promise<AwardedMiles[]> {
    const client: Client = new Client();
    // client.setClientType(null);
    // client.setDefaultPaymentType(null);
    client.setLastName('test');
    client.setName('test');
    client.id = 'dsadad';
    // client.setType(null);

    // const awardedMiles: AwardedMiles = new AwardedMiles();

    // awardedMiles.setClient(client);
    // awardedMiles.setDate(new Date());
    // awardedMiles.setExpirationDate(null);
    // awardedMiles.setIsSpecial(null);
    // awardedMiles.setMiles(1);
    // // awardedMiles.setTransit();

    return this.awardedMilesRepository.findAllByClient(client);
  }
}
