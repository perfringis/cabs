import { Controller, Get } from '@nestjs/common';
import dayjs from 'dayjs';
import { Address } from 'src/entity/Address';
import { AwardedMiles } from 'src/entity/AwardedMiles';
import { Client, ClientType, PaymentType, Type } from 'src/entity/Client';
import { AddressRepository } from 'src/repository/AddressRepository';
import { AwardedMilesRepository } from 'src/repository/AwardedMilesRepository';
import { ClientRepository } from 'src/repository/ClientRepository';
import { AwardsService } from 'src/service/AwardsService';

@Controller()
export class TestController {
  constructor(
    private clientRepository: ClientRepository,
    private awardedMilesRepository: AwardedMilesRepository,
    private awardsService: AwardsService,
    private addressRepository: AddressRepository,
  ) {}

  @Get('/test')
  public async test() {
    const addr: Address = new Address('Poland', 'Wroclaw', 'Swobodna', 1);

    addr.setCountry('Poland');
    addr.setDistrict('Krzyki');
    addr.setCity('Wroclaw');
    addr.setStreet('Swobodna');
    addr.setBuildingNumber(1);
    addr.setAdditionalNumber(1);
    addr.setPostalCode('12-345');
    addr.setName('John');

    await this.addressRepository.save(addr);
  }
}
