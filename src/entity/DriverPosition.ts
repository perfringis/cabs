import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Driver } from './Driver';

@Entity({ name: 'driver_position' })
export class DriverPosition extends BaseEntity {
  @Column({ nullable: false, type: 'double' })
  private latitude: number;

  @Column({ nullable: false, type: 'double' })
  private longitude: number;

  @Column({ name: 'seen_at', nullable: false, type: 'bigint' })
  private seenAt: number;

  // @ManyToOne(() => Driver, (driver) => driver)
  // public driver: Driver;

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

  // public getDriver(): Driver {
  //   return this.driver;
  // }

  // public setDriver(driver: Driver): void {
  //   this.driver = driver;
  // }
}
