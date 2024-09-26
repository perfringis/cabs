import { AddressDTO } from './AddressDTO';

export class AnalyzedAddressesDTO {
  public addresses: AddressDTO[];

  constructor(addresses: AddressDTO[]) {
    this.addresses = addresses;
  }

  public getAddresses(): AddressDTO[] {
    return this.addresses;
  }

  public setAddresses(addresses: AddressDTO[]): void {
    this.addresses = addresses;
  }
}
