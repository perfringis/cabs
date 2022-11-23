import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Driver } from './Driver';

export enum FeeType {
  FLAT = 'flat',
  PERCENTAGE = 'percentage',
}

@Entity({ name: 'driver_fee' })
export class DriverFee extends BaseEntity {
  @Column({ name: 'fee_type', nullable: false, type: 'enum', enum: FeeType })
  private feeType: FeeType;

  @Column({ nullable: false, type: 'int' })
  private amount: number;

  @Column({ nullable: true, type: 'int' })
  private min: number | null;

  @OneToOne(() => Driver, (driver) => driver.fee)
  @JoinColumn({ name: 'driver_id' })
  public driver: Driver;

  constructor(
    feeType: FeeType,
    driver: Driver,
    amount: number,
    min: number | null,
  ) {
    super();

    this.feeType = feeType;
    this.driver = driver;
    this.amount = amount;
    this.min = min;
  }

  public getFeeType(): FeeType {
    return this.feeType;
  }

  public setFeeType(feeType: FeeType): void {
    this.feeType = feeType;
  }

  public getAmount(): number {
    return this.amount;
  }

  public setAmount(amount: number): void {
    this.amount = amount;
  }

  public getMin(): number | null {
    return this.min;
  }

  public setMin(min: number | null): void {
    this.min = min;
  }

  public getDriver(): Driver {
    return this.driver;
  }

  public setDriver(driver: Driver): void {
    this.driver = driver;
  }
}
