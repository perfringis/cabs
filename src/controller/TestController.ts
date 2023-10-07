import { Controller, Get } from '@nestjs/common';
import { AwardsAccount } from 'src/entity/AwardsAccount';
import { Client } from 'src/entity/Client';
import { AwardsAccountRepository } from 'src/repository/AwardsAccountRepository';

@Controller('test')
export class TestController {
  constructor(private awardsAccountRepository: AwardsAccountRepository) {}

  @Get('test')
  public async test(): Promise<AwardsAccount> {
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

    return this.awardsAccountRepository.findByClient(client);
  }
}
