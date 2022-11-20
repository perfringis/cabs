import { BaseEntity } from 'src/common/BaseEntity';
import { Column, ManyToOne } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { CarClass } from './CarType';
import { Driver } from './Driver';

@Entity()
export class DriverSession extends BaseEntity {
  @Column({ nullable: false, type: 'bigint' })
  private loggedAt: number;

  @Column({ nullable: true, type: 'bigint' })
  private loggedOutAt: number | null;

  @ManyToOne(() => Driver, (driver) => driver)
  public driver: Driver;

  @Column({ nullable: false, type: 'varchar' })
  private platesNumber: string;

  @Column({ nullable: true, type: 'enum', enum: CarClass })
  private carClass: CarClass;

  public getLoggedAt(): number {
    return this.loggedAt;
  }

  public setLoggedAt(loggedAt: number): void {
    this.loggedAt = loggedAt;
  }

  public getLoggedOutAt(): number | null {
    return this.loggedOutAt;
  }

  public setLoggedOutAt(loggedOutAt: number | null): void {
    this.loggedOutAt = loggedOutAt;
  }

  public getDriver(): Driver {
    return this.driver;
  }

  public setDriver(driver: Driver): void {
    this.driver = driver;
  }

  public getPlatesNumber(): string {
    return this.platesNumber;
  }

  public setPlatesNumber(platesNumber: string): void {
    this.platesNumber = platesNumber;
  }

  public getCarClass(): CarClass {
    return this.carClass;
  }

  public setCarClass(carClass: CarClass): void {
    this.carClass = carClass;
  }
}
