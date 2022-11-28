export class DriverPositionDTO {
  private latitude: number;
  private longitude: number;
  private seenAt: number;
  public driverId: string;

  constructor(
    driverId: string,
    latitude: number,
    longitude: number,
    seenAt: number,
  ) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.seenAt = seenAt;
    this.driverId = driverId;
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

  public getSeenAt(): number {
    return this.seenAt;
  }

  public setSeenAt(seenAt: number): void {
    this.seenAt = seenAt;
  }

  public getDriverId(): string {
    return this.driverId;
  }

  public setDriverId(driverId: string): void {
    this.driverId = driverId;
  }
}
