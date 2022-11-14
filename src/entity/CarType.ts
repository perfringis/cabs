import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity } from 'typeorm';

export enum CarClass {
  ECO = 'eco',
  REGULAR = 'regular',
  VAN = 'van',
  PREMIUM = 'premium',
}

export enum CarStatus {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
}

@Entity()
export class CarType extends BaseEntity {
  @Column({ nullable: false, type: 'enum', enum: CarClass })
  private carClass: CarClass;

  @Column({ nullable: true, type: 'varchar' })
  private description: string | null;

  @Column({
    nullable: true,
    type: 'enum',
    enum: CarStatus,
    default: CarStatus.INACTIVE,
  })
  private status: CarStatus | null;

  @Column({ nullable: false, type: 'bigint' })
  private carsCounter: number;

  @Column({ nullable: false, type: 'bigint' })
  private minNoOfCarsToActivateClass: number;

  @Column({ nullable: false, type: 'bigint' })
  private activeCarsCounter: number;

  constructor(
    carClass: CarClass,
    description: string | null,
    minNoOfCarsToActivateClass: number,
  ) {
    super();

    this.carClass = carClass;
    this.description = description;
    this.minNoOfCarsToActivateClass = minNoOfCarsToActivateClass;
  }

  public getCarClass(): CarClass {
    return this.carClass;
  }

  public setCarClass(carClass: CarClass): void {
    this.carClass = carClass;
  }

  public getDescription(): string | null {
    return this.description;
  }

  public setDescription(description: string | null): void {
    this.description = description;
  }

  public getStatus(): CarStatus | null {
    return this.status;
  }

  public setStatus(status: CarStatus | null): void {
    this.status = status;
  }

  public getCarsCounter(): number {
    return this.carsCounter;
  }

  public setCarsCounter(carsCounter: number): void {
    this.carsCounter = carsCounter;
  }

  public getMinNoOfCarsToActivateClass(): number {
    return this.minNoOfCarsToActivateClass;
  }

  public setMinNoOfCarsToActivateClass(
    minNoOfCarsToActivateClass: number,
  ): void {
    this.minNoOfCarsToActivateClass = minNoOfCarsToActivateClass;
  }

  public getActiveCarsCounter(): number {
    return this.activeCarsCounter;
  }

  public setActiveCarsCounter(activeCarsCounter: number): void {
    this.activeCarsCounter = activeCarsCounter;
  }
}
