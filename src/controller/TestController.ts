import { Controller, Get } from '@nestjs/common';
import { Address } from 'src/entity/Address';
import { Client, ClientType } from 'src/entity/Client';
import { Driver } from 'src/entity/Driver';
import { Status, Transit } from 'src/entity/Transit';
import { TransitRepository } from 'src/repository/TransitRepository';

@Controller('test')
export class TestController {
  constructor(private transitRepository: TransitRepository) {}

  @Get('test')
  public async test(): Promise<Transit[]> {
    const driver: Driver = new Driver();
    driver.id = 'xd1';

    const address: Address = new Address('x', 'x', 'x', 1);
    address.id = 'c1';

    const client: Client = new Client();
    client.id = 'dsadad';

    const now = new Date();
    now.setFullYear(now.getFullYear() - 20);

    return await this.transitRepository.findByClient(client);
  }
}
