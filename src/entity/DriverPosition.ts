import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Driver } from './Driver';

@Entity()
export class DriverPosition extends BaseEntity {
  @ManyToOne(() => Driver, (driver) => driver)
  public driver: Driver;

  @Column({ nullable: false, type: 'float' })
  private latitude: number;

  @Column({ nullable: false, type: 'float' })
  private longitude: number;

  @Column({ nullable: false, type: 'bigint' })
  private seenAt: number;

  public getDriver(): Driver {
    return this.driver;
  }

  public setDriver(driver: Driver): void {
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

  public getSeenAt(): number {
    return this.seenAt;
  }

  public setSeenAt(seenAt: number): void {
    this.seenAt = seenAt;
  }
}
