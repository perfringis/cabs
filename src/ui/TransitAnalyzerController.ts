import { Controller, Get, Param } from '@nestjs/common';
import { AddressDTO } from 'src/dto/AddressDTO';
import { AnalyzedAddressesDTO } from 'src/dto/AnalyzedAddressesDTO';
import { Address } from 'src/entity/Address';
import { TransitAnalyzer } from 'src/service/TransitAnalyzer';

@Controller()
export class TransitAnalyzerController {
  constructor(private transitAnalyzer: TransitAnalyzer) {}

  @Get('/transitAnalyze/:clientId/:addressId')
  public async analyze(
    @Param('clientId') clientId: string,
    @Param('addressId') addressId: string,
  ): Promise<AnalyzedAddressesDTO> {
    const addresses: Address[] = await this.transitAnalyzer.analyze(
      clientId,
      addressId,
    );
    const addressDTOs: AddressDTO[] = addresses.map((t) => {
      return new AddressDTO(t);
    });

    return new AnalyzedAddressesDTO(addressDTOs);
  }
}
