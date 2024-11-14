import { CarClass } from 'src/entity/CarType';
import { Status, Transit } from 'src/entity/Transit';
import { AddressDTO } from './AddressDTO';
import { ClientDTO } from './ClientDTO';
import { DriverDTO } from './DriverDTO';
import { ClaimDTO } from './ClaimDTO';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import { NotAcceptableException } from '@nestjs/common';
import { Distance } from 'src/entity/Distance';

dayjs.extend(dayOfYear);

export class TransitDTO {
  public id: string;
  public tariff: string;
  public status: Status | null;
  public driver: DriverDTO;
  public factor: number | null;
  public distance: Distance;
  public distanceUnit: string;
  public kmRate: number;
  public price: number | null;
  public driverFee: number | null;
  public estimatedPrice: number | null;
  public date: Date | null;
  public dateTime: Date | null;
  public published: Date | null;
  public acceptedAt: Date | null;
  public started: Date | null;
  public completeAt: Date | null;
  public claimDTO: ClaimDTO;
  public proposedDrivers: DriverDTO[] = [];
  public to: AddressDTO;
  public from: AddressDTO;
  public carClass: CarClass;
  public clientDTO: ClientDTO;

  constructor(transit: Transit) {
    this.id = transit.getId();
    this.distance = transit.getKm();
    this.factor = transit.factor;
    if (transit.getPrice() !== null) {
      this.price = transit.getPrice().toInt();
    }
    this.date = transit.getDateTime();
    this.status = transit.getStatus();

    this.setTariff(transit);

    for (const driver of transit.getProposedDrivers()) {
      this.proposedDrivers.push(new DriverDTO(driver));
    }

    this.to = new AddressDTO(transit.getTo());
    this.from = new AddressDTO(transit.getFrom());
    this.carClass = transit.getCarType();
    this.clientDTO = new ClientDTO(transit.getClient());
    if (transit.getDriversFee()) {
      this.driverFee = transit.getDriversFee().toInt();
    }
    if (transit.getEstimatedPrice()) {
      this.estimatedPrice = transit.getEstimatedPrice().toInt();
    }
    this.dateTime = transit.getDateTime();
    this.published = transit.getPublished();
    this.acceptedAt = transit.getAcceptedAt();
    this.started = transit.getStarted();
    this.completeAt = transit.getCompleteAt();
  }

  public getKmRate(): number {
    return this.kmRate;
  }

  private setTariff(transit: Transit): void {
    const day = dayjs();

    // wprowadzenie nowych cennikow od 1.01.2019
    if (day.year() <= 2018) {
      this.kmRate = 1.0;
      this.tariff = 'standard';

      return;
    }

    const year: number = day.year();
    const leap: boolean =
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    if (
      (leap && day.dayOfYear() === 366) ||
      (!leap && day.dayOfYear() === 365) ||
      (day.dayOfYear() === 1 && day.hour() <= 6)
    ) {
      this.tariff = 'sylwester';
      this.kmRate = 3.5;
    } else {
      switch (day.day()) {
        case 1: // Monday
        case 2: // Tuesday
        case 3: // Wednesday
        case 4: // Thursday
          this.kmRate = 1.0;
          this.tariff = 'standard';
          break;
        case 5: // Friday
          if (day.hour() < 17) {
            this.tariff = 'standard';
            this.kmRate = 1.0;
          } else {
            this.tariff = 'weekend+';
            this.kmRate = 2.5;
          }
          break;
        case 6: // Saturday
          if (day.hour() < 6 || day.hour() >= 17) {
            this.kmRate = 2.5;
            this.tariff = 'weekend+';
          } else if (day.hour() < 17) {
            this.kmRate = 1.5;
            this.tariff = 'weekend';
          }
          break;
        case 0: // Sunday
          if (day.hour() < 6) {
            this.kmRate = 2.5;
            this.tariff = 'weekend';
          } else {
            this.kmRate = 1.5;
            this.tariff = 'weekend';
          }
          break;
      }
    }
  }

  public getTariff(): string {
    return this.tariff;
  }

  public getDistance(unit: string): string {
    this.distanceUnit = unit;

    return this.distance.printIn(unit);
  }

  public getProposedDrivers(): DriverDTO[] {
    return this.proposedDrivers;
  }

  public setProposedDrivers(proposedDrivers: DriverDTO[]): void {
    this.proposedDrivers = proposedDrivers;
  }

  public getClaimDTO(): ClaimDTO {
    return this.claimDTO;
  }

  public setClaimDTO(claimDTO: ClaimDTO): void {
    this.claimDTO = claimDTO;
  }

  public getTo(): AddressDTO {
    return this.to;
  }

  public setTo(to: AddressDTO): void {
    this.to = to;
  }

  public getFrom() {
    return this.from;
  }

  public setFrom(from: AddressDTO): void {
    this.from = from;
  }

  public getCarClass(): CarClass {
    return this.carClass;
  }

  public setCarClass(carClass: CarClass): void {
    this.carClass = carClass;
  }

  public getClientDTO() {
    return this.clientDTO;
  }

  public setClientDTO(clientDTO: ClientDTO): void {
    this.clientDTO = clientDTO;
  }

  public getId(): string {
    return this.id;
  }

  public getStatus(): Status {
    return this.status;
  }

  public setStatus(status: Status): void {
    this.status = status;
  }

  public getPrice(): number {
    return this.price;
  }

  public getDriverFee(): number {
    return this.driverFee;
  }

  public setDriverFee(driverFee: number): void {
    this.driverFee = driverFee;
  }

  public getDateTime(): Date {
    return this.dateTime;
  }

  public setDateTime(dateTime: Date): void {
    this.dateTime = dateTime;
  }

  public getPublished(): Date {
    return this.published;
  }

  public setPublished(published: Date): void {
    this.published = published;
  }

  public getAcceptedAt(): Date {
    return this.acceptedAt;
  }

  public setAcceptedAt(acceptedAt: Date): void {
    this.acceptedAt = acceptedAt;
  }

  public getStarted(): Date {
    return this.started;
  }

  public setStarted(started: Date): void {
    this.started = started;
  }

  public getCompleteAt(): Date {
    return this.completeAt;
  }

  public setCompleteAt(completeAt: Date): void {
    this.completeAt = completeAt;
  }

  public getEstimatedPrice(): number {
    return this.estimatedPrice;
  }

  public setEstimatedPrice(estimatedPrice: number): void {
    this.estimatedPrice = estimatedPrice;
  }
}
