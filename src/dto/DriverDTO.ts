import { Driver, DriverStatus, DriverType } from 'src/entity/Driver';

export class DriverDTO {
  private id: string;
  private type: DriverType | null;
  private status: DriverStatus;
  private firstName: string | null;
  private lastName: string | null;
  private photo: string | null;
  private driverLicense: string;
  private isOccupied: boolean;

  constructor(driver: Driver) {
    this.id = driver.getId();
    this.type = driver.getType();
    this.status = driver.getStatus();
    this.firstName = driver.getFirstName();
    this.lastName = driver.getLastName();
    this.photo = driver.getPhoto();
    this.driverLicense = driver.getDriverLicense();
    this.isOccupied = driver.getIsOccupied();
  }

  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getType(): DriverType | null {
    return this.type;
  }

  public setType(type: DriverType | null): void {
    this.type = type;
  }

  public getStatus(): DriverStatus {
    return this.status;
  }

  public setStatus(status: DriverStatus): void {
    this.status = status;
  }

  public getFirstName(): string | null {
    return this.firstName;
  }

  public setFirstName(firstName: string | null): void {
    this.firstName = firstName;
  }

  public getLastName(): string | null {
    return this.lastName;
  }

  public setLastName(lastName: string | null): void {
    this.lastName = lastName;
  }

  public getPhoto(): string | null {
    return this.photo;
  }

  public setPhoto(photo: string | null): void {
    this.photo = photo;
  }

  public getDriverLicense(): string {
    return this.driverLicense;
  }

  public setDriverLicense(driverLicense: string): void {
    this.driverLicense = driverLicense;
  }

  public getIsOccupied(): boolean {
    return this.isOccupied;
  }

  public setIsOccupied(isOccupied: boolean): void {
    this.isOccupied = isOccupied;
  }
}
