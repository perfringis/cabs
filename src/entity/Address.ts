import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity } from 'typeorm';
import objectHash from 'object-hash';

@Entity()
export class Address extends BaseEntity {
  @Column({ nullable: true, type: 'varchar' }) // TODO: change
  private country: string | null;

  @Column({ nullable: true, type: 'varchar' }) // TODO: change
  private district: string | null;

  @Column({ nullable: true, type: 'varchar' }) // TODO: change
  private city: string | null;

  @Column({ nullable: true, type: 'varchar' }) // TODO: change
  private street: string | null;

  @Column({ nullable: true, type: 'bigint' }) // TODO: change
  private buildingNumber: number | null;

  @Column({ nullable: true, type: 'bigint' }) // TODO: change
  private additionalNumber: number | null;

  @Column({ nullable: true, type: 'varchar' }) // TODO: change
  private postalCode: string | null;

  @Column({ nullable: true, type: 'varchar' }) // TODO: change
  private name: string | null;

  @Column({ nullable: true, type: 'varchar', unique: true }) // TODO: change
  private hash: string | null;

  constructor(
    country: string,
    city: string,
    street: string,
    buildingNumber: number,
  ) {
    super();
    this.country = country;
    this.city = city;
    this.street = street;
    this.buildingNumber = buildingNumber;
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

  public getHash(): string | null {
    return this.hash;
  }

  public setHash(): void {
    this.hash = objectHash({
      country: this.country,
      district: this.district,
      city: this.city,
      street: this.street,
      buildingNumber: this.buildingNumber,
      additionalNumber: this.additionalNumber,
      postalCode: this.postalCode,
      name: this.name,
    });
  }

  public toString(): string {
    return (
      'Address{' +
      "id='" +
      this.getId() +
      "'" +
      ", country='" +
      this.country +
      "'" +
      ", district='" +
      this.district +
      "'" +
      ", city='" +
      this.city +
      "'" +
      ", street='" +
      this.street +
      "'" +
      ', buildingNumber=' +
      this.buildingNumber +
      ', additionalNumber=' +
      this.additionalNumber +
      ", postalCode='" +
      this.postalCode +
      "'" +
      ", name='" +
      this.name +
      "'" +
      '}'
    );
  }
}
