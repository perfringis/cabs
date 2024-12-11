import { NotAcceptableException } from '@nestjs/common';
import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, VersionColumn } from 'typeorm';

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

@Entity({ name: 'car_type' })
export class CarType extends BaseEntity {
  @Column({ name: 'car_class', nullable: false, type: 'enum', enum: CarClass })
  public carClass: CarClass;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  private description: string | null;

  @Column({
    nullable: true,
    type: 'enum',
    enum: CarStatus,
    default: CarStatus.INACTIVE,
  })
  public status: CarStatus | null;

  @Column({ name: 'cars_counter', nullable: false, type: 'int', default: 0 })
  private carsCounter: number;

  @Column({
    name: 'min_no_of_cars_to_activate_class',
    nullable: false,
    type: 'int',
  })
  private minNoOfCarsToActivateClass: number;

  @VersionColumn({ type: 'int', nullable: true })
  private version: number | null;

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

  public activate(): void {
    if (this.carsCounter < this.minNoOfCarsToActivateClass) {
      throw new NotAcceptableException(
        `Cannot activate car class when less than ${this.minNoOfCarsToActivateClass} cars in the fleet`,
      );
    }

    this.status = CarStatus.ACTIVE;
  }

  public deactivate(): void {
    this.status = CarStatus.INACTIVE;
  }

  public getCarsCounter(): number {
    return this.carsCounter;
  }

  public registerCar(): void {
    this.carsCounter++;
  }

  public unregisterCar(): void {
    this.carsCounter--;
    if (this.carsCounter < 0) {
      throw new NotAcceptableException();
    }
  }

  public getMinNoOfCarsToActivateClass(): number {
    return this.minNoOfCarsToActivateClass;
  }
}
