import { Driver } from 'src/entity/Driver';

export class DriverPositionDTOV2 {
  private latitude: number;
  private longitude: number;
  private seenAt: Date;
  public driver: Driver;

  constructor(
    driver: Driver,
    latitude: number,
    longitude: number,
    seenAt: Date,
  ) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.seenAt = seenAt;
    this.driver = driver;
  }

  public getLatitude(): number {
    return this.latitude;
  }

  public setLatitude(latitude: number): void {
    this.latitude = latitude;
  }

  public getLongitude(): number {
    return this.longitude;
  }

  public setLongitude(longitude: number): void {
    this.longitude = longitude;
  }

  public getSeenAt(): Date {
    return this.seenAt;
  }

  public setSeenAt(seenAt: Date): void {
    this.seenAt = seenAt;
  }

  public getDriver(): Driver {
    return this.driver;
  }

  public setDriver(driver: Driver): void {
    this.driver = driver;
  }
}
