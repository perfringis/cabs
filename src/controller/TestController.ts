import { Controller, Get } from '@nestjs/common';
import { Address } from 'src/entity/Address';
import { AddressRepository } from 'src/repository/AddressRepository';

@Controller('test')
export class TestController {
  constructor(private addressRepository: AddressRepository) {}

  @Get('test')
  public async test(): Promise<Address> {
    const address: Address = new Address('x', 'x', 'x', 1);
    return await this.addressRepository.getOne('');
  }
}
