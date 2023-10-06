import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, VersionColumn } from 'typeorm';
import objectHash from 'object-hash';

@Entity({ name: 'address' })
export class Address extends BaseEntity {
  @Column({ nullable: true, type: 'varchar', length: 255 })
  private country: string | null;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  private district: string | null;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  private city: string | null;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  private street: string | null;

  @Column({ name: 'building_number', nullable: true, type: 'int' })
  private buildingNumber: number | null;

  @Column({ name: 'additional_number', nullable: true, type: 'int' })
  private additionalNumber: number | null;

  @Column({ name: 'postal_code', nullable: true, type: 'varchar', length: 255 })
  private postalCode: string | null;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  private name: string | null;

  @Column({ nullable: true, type: 'varchar', length: 255, unique: true })
  hash: string | null;

  @VersionColumn({ type: 'int', nullable: true })
  private version: number | null;

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
    // prettier-ignore
    return (
      'Address{' +
      "id='" + this.getId() + "'" +
      ", country='" + this.country + "'" +
      ", district='" + this.district + "'" +
      ", city='" + this.city + "'" +
      ", street='" + this.street + "'" +
      ', buildingNumber=' + this.buildingNumber +
      ', additionalNumber=' + this.additionalNumber +
      ", postalCode='" + this.postalCode + "'" +
      ", name='" + this.name + "'" +
      '}'
    );
  }
}
