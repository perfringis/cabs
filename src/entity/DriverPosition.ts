import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne, VersionColumn } from 'typeorm';
import { Driver } from './Driver';

@Entity({ name: 'driver_position' })
export class DriverPosition extends BaseEntity {
  @Column({ nullable: false, type: 'double' })
  private latitude: number;

  @Column({ nullable: false, type: 'double' })
  private longitude: number;

  @Column({ name: 'seen_at', nullable: false, type: 'datetime' })
  private seenAt: Date;

  @ManyToOne(() => Driver, (driver) => driver)
  @JoinColumn({ name: 'driver_id' })
  public driver: Driver;

  @VersionColumn({ type: 'int', nullable: true })
  private version: number | null;

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
