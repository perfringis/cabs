import { Controller, Get } from '@nestjs/common';
import dayjs from 'dayjs';
import { Address } from 'src/entity/Address';
import { CarClass } from 'src/entity/CarType';
import { PaymentType } from 'src/entity/Client';
import {
  ClientPaymentStatus,
  DriverPaymentStatus,
  Status,
  Transit,
} from 'src/entity/Transit';
import { AddressRepository } from 'src/repository/AddressRepository';
import { AwardedMilesRepository } from 'src/repository/AwardedMilesRepository';
import { ClientRepository } from 'src/repository/ClientRepository';
import { TransitRepository } from 'src/repository/TransitRepository';
import { AwardsService } from 'src/service/AwardsService';

@Controller()
export class TestController {
  constructor(
    private clientRepository: ClientRepository,
    private awardedMilesRepository: AwardedMilesRepository,
    private awardsService: AwardsService,
    private addressRepository: AddressRepository,
    private transitRepository: TransitRepository,
  ) {}

  @Get('/test')
  public async test() {
    // const transit: Transit = new Transit();
    // transit.setDriverPaymentStatus(DriverPaymentStatus.PAID);
    // transit.setClientPaymentStatus(ClientPaymentStatus.PAID);
    // transit.setPaymentType(PaymentType.MONTHLY_INVOICE);
    // transit.setStatus(Status.DRAFT);
    // transit.setDate(dayjs().toDate());
    // transit.setPickupAddressChangeCounter(1);
    // transit.setAcceptedAt(dayjs().toDate());
    // transit.setStarted(dayjs().toDate());
    // transit.setAwaitingDriversResponses(1);
    // transit.setKm(100);
    // transit.setPrice(100);
    // transit.setEstimatedPrice(100);
    // transit.setDriversFee(100);
    // transit.setDateTime(dayjs().toDate());
    // transit.setPublished(dayjs().toDate());
    // transit.setCompleteAt(dayjs().toDate());
    // transit.setCarType(CarClass.REGULAR);

    // await this.transitRepository.save(transit);

    const addr: Address = new Address('Poland', 'Wroclaw', 'Swobodna', 1);

    addr.setCountry('Croatia');
    addr.setDistrict('Split');
    addr.setCity('Split');
    addr.setStreet('Prodova');
    addr.setBuildingNumber(1);
    addr.setAdditionalNumber(1);
    addr.setPostalCode('12-345');
    addr.setName('Bruno');

    await this.addressRepository.save(addr);
  }
}
