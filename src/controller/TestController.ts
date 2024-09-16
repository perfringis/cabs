import { Controller, Get } from '@nestjs/common';
import { AddressDTO } from 'src/dto/AddressDTO';
import { TransitDTO } from 'src/dto/TransitDTO';
import { Address } from 'src/entity/Address';
import { CarClass } from 'src/entity/CarType';
import { Transit } from 'src/entity/Transit';
import { AddressRepository } from 'src/repository/AddressRepository';
import { TransitRepository } from 'src/repository/TransitRepository';
import { TransitService } from 'src/service/TransitService';

@Controller()
export class TestController {
  constructor(
    private transitService: TransitService,
    private transitRepository: TransitRepository,
    private addressRepository: AddressRepository,
  ) {}

  @Get('test')
  public async test(): Promise<void> {
    await this.transitService.loadTransit('ts_3');
  }
}
