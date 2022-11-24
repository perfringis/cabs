import { CarClass, CarStatus, CarType } from 'src/entity/CarType';

export class CarTypeDTO {
  private id: string;
  private carClass: CarClass;
  private description: string | null;
  private status: CarStatus | null;
  private carsCounter: number;
  private minNoOfCarsToActivateClass: number;
  private activeCarsCounter: number;

  constructor(carType: CarType) {
    this.id = carType.getId();
    this.carClass = carType.getCarClass();
    this.description = carType.getDescription();
    this.status = carType.getStatus();
    this.carsCounter = carType.getCarsCounter();
    this.minNoOfCarsToActivateClass = carType.getMinNoOfCarsToActivateClass();
    this.activeCarsCounter = carType.getActiveCarsCounter();
  }

  public getId(): string {
    return this.id;
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
