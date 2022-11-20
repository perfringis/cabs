import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, OneToOne } from 'typeorm';
import { Driver } from './Driver';

export enum FeeType {
  FLAT = 'flat',
  PERCENTAGE = 'percentage',
}

@Entity()
export class DriverFee extends BaseEntity {
  @Column({ nullable: false, type: 'enum', enum: FeeType })
  private feeType: FeeType;

  @OneToOne(() => Driver, (driver) => driver.fee)
  public driver: Driver;

  @Column({ nullable: false, type: 'bigint' })
  private amount: number;

  @Column({ nullable: true, type: 'bigint' })
  private min: number | null;

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

  public getDriver(): Driver {
    return this.driver;
  }

  public setDriver(driver: Driver): void {
    this.driver = driver;
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
}
