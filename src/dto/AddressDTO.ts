import { Address } from 'src/entity/Address';

export class AddressDTO {
  public country: string | null;
  public district: string | null;
  public city: string | null;
  public street: string | null;
  public buildingNumber: number | null;
  public additionalNumber: number | null;
  public postalCode: string | null;
  public name: string | null;

  constructor(
    a:
      | Address
      | AddressDTO
      | {
          country: string | null;
          district: string | null;
          city: string | null;
          street: string | null;
          buildingNumber: number | null;
          additionalNumber: number | null;
          postalCode: string | null;
          name: string | null;
        },
  ) {
    if (a instanceof Address) {
      this.country = a.getCountry();
      this.district = a.getDistrict();
      this.city = a.getCity();
      this.street = a.getStreet();
      this.buildingNumber = a.getBuildingNumber();
      this.additionalNumber = a.getAdditionalNumber();
      this.postalCode = a.getPostalCode();
      this.name = a.getName();
    } else if (a instanceof AddressDTO) {
      this.country = a.country;
      this.district = a.district;
      this.city = a.city;
      this.street = a.street;
      this.buildingNumber = a.buildingNumber;
      this.additionalNumber = a.additionalNumber;
      this.postalCode = a.postalCode;
      this.name = a.name;
    } else {
      this.country = a.country;
      this.district = a.district;
      this.city = a.city;
      this.street = a.street;
      this.buildingNumber = a.buildingNumber;
      this.additionalNumber = a.additionalNumber;
      this.postalCode = a.postalCode;
      this.name = a.name;
    }
  }

  public getCountry(): string | null {
    return this.country;
  }

  public setCountry(country: string): void {
    this.country = country;
  }

  public getDistrict(): string | null {
    return this.district;
  }

  public setDistrict(district: string): void {
    this.district = district;
  }

  public getCity(): string | null {
    return this.city;
  }

  public setCity(city: string): void {
    this.city = city;
  }

  public getStreet(): string | null {
    return this.street;
  }

  public setStreet(street: string): void {
    this.street = street;
  }

  public getBuildingNumber(): number | null {
    return this.buildingNumber;
  }

  public setBuildingNumber(buildingNumber: number): void {
    this.buildingNumber = buildingNumber;
  }

  public getAdditionalNumber(): number | null {
    return this.additionalNumber;
  }

  public setAdditionalNumber(additionalNumber: number): void {
    this.additionalNumber = additionalNumber;
  }

  public getPostalCode(): string | null {
    return this.postalCode;
  }

  public setPostalCode(postalCode: string): void {
    this.postalCode = postalCode;
  }

  public getName(): string | null {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public toAddressEntity(): Address {
    const address: Address = new Address(
      this.getCountry(),
      this.getCity(),
      this.getStreet(),
      this.getBuildingNumber(),
    );

    address.setDistrict(this.getDistrict());
    address.setAdditionalNumber(this.getAdditionalNumber());
    address.setPostalCode(this.getPostalCode());
    address.setName(this.getName());
    // TODO add in future if necessary
    // address.setHash();

    return address;
  }
}
