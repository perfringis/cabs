import { CarClass } from 'src/entity/CarType';
import { DriverSession } from 'src/entity/DriverSession';

export class DriverSessionDTO {
  private loggedAt: Date;
  private loggedOutAt: Date | null;
  public platesNumber: string;
  public carClass: CarClass | null;
  public carBrand: string | null;

  constructor(session: DriverSession) {
    this.loggedAt = session.getLoggedAt();
    this.loggedOutAt = session.getLoggedOutAt();
    this.platesNumber = session.getPlatesNumber();
    this.carClass = session.getCarClass();
    this.carBrand = session.getCarBrand();
  }

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
}
