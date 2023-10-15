import { BaseEntity } from 'src/common/BaseEntity';
import { Column, JoinColumn, ManyToOne, VersionColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { CarClass } from './CarType';
import { Driver } from './Driver';

@Entity({ name: 'driver_session' })
export class DriverSession extends BaseEntity {
  @Column({ name: 'logged_at', nullable: false, type: 'datetime' })
  public loggedAt: Date;

  @Column({ name: 'logged_out_at', nullable: true, type: 'datetime' })
  public loggedOutAt: Date | null;

  @Column({
    name: 'plates_number',
    nullable: false,
    type: 'varchar',
    length: 255,
  })
  private platesNumber: string;

  @Column({ name: 'car_class', nullable: true, type: 'enum', enum: CarClass })
  public carClass: CarClass | null;

  @Column({ name: 'car_brand', nullable: true, type: 'varchar', length: 255 })
  private carBrand: string | null;

  @ManyToOne(() => Driver, (driver) => driver)
  @JoinColumn({ name: 'driver_id' })
  public driver: Driver;

  @VersionColumn({ type: 'int', nullable: true })
  private version: number | null;

  public getLoggedAt(): Date {
    return this.loggedAt;
  }

  public setLoggedAt(loggedAt: Date): void {
    this.loggedAt = loggedAt;
  }

  public getLoggedOutAt(): Date | null {
    return this.loggedOutAt;
  }

  public setLoggedOutAt(loggedOutAt: Date | null): void {
    this.loggedOutAt = loggedOutAt;
  }

  public getPlatesNumber(): string {
    return this.platesNumber;
  }

  public setPlatesNumber(platesNumber: string): void {
    this.platesNumber = platesNumber;
  }

  public getCarClass(): CarClass | null {
    return this.carClass;
  }

  public setCarClass(carClass: CarClass | null): void {
    this.carClass = carClass;
  }

  public getCarBrand(): string | null {
    return this.carBrand;
  }

  public setCarBrand(carBrand: string | null): void {
    this.carBrand = carBrand;
  }

  public getDriver(): Driver {
    return this.driver;
  }

  public setDriver(driver: Driver): void {
    this.driver = driver;
  }
}
