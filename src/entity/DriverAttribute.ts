import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Driver } from './Driver';

export enum DriverAttributeName {
  PENALTY_POINTS = 'penalty_points',
  NATIONALITY = 'nationality',
  YEARS_OF_EXPERIENCE = 'years_of_experience',
  MEDICAL_EXAMINATION_EXPIRATION_DATE = 'medial_examination_expiration_date',
  MEDICAL_EXAMINATION_REMARKS = 'medical_examination_remarks',
  EMAIL = 'email',
  BIRTHPLACE = 'birthplace',
  COMPANY_NAME = 'companyName',
}

@Entity({ name: 'driver_attribute' })
export class DriverAttribute extends BaseEntity {
  @Column({ nullable: false, type: 'enum', enum: DriverAttributeName })
  private name: DriverAttributeName;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  private value: string;

  @ManyToOne(() => Driver, (driver) => driver.attributes)
  @JoinColumn({ name: 'driver_id' })
  public driver: Driver;

  constructor(driver: Driver, attribute: DriverAttributeName, value: string) {
    super();

    this.driver = driver;
    this.name = attribute;
    this.value = value;
  }

  public getName(): DriverAttributeName {
    return this.name;
  }

  public setName(name: DriverAttributeName): void {
    this.name = name;
  }

  public getValue(): string {
    return this.value;
  }

  public setValue(value: string): void {
    this.value = value;
  }

  public getDriver(): Driver {
    return this.driver;
  }

  public setDriver(driver: Driver): void {
    this.driver = driver;
  }
}
