import { CarClass } from 'src/entity/CarType';
import { Status, Transit } from 'src/entity/Transit';
import { AddressDTO } from './AddressDTO';
import { ClientDTO } from './ClientDTO';
import { DriverDTO } from './DriverDTO';
import { ClaimDTO } from './ClaimDTO';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import utc from 'dayjs/plugin/utc';
import { Distance } from 'src/entity/Distance';

dayjs.extend(utc);
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
  public baseFee: number;
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

  constructor(transit?: Transit) {
    if (transit) {
      this.id = transit.getId();
      this.distance = transit.getKm();
      this.factor = 1;
      if (transit.getPrice() !== null) {
        this.price = transit.getPrice().toInt();
      }
      this.date = transit.getDateTime();
      this.status = transit.getStatus();

      this.setTariff(transit);

      if (transit.getProposedDrivers()) {
        for (const driver of transit.getProposedDrivers()) {
          this.proposedDrivers.push(new DriverDTO(driver));
        }
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
  }

  public getKmRate(): number {
    return this.kmRate;
  }

  private setTariff(transit: Transit): void {
    // wprowadzenie nowych cennikow od 1.01.2019
    this.tariff = transit.getTariff().getName();
    this.kmRate = transit.getTariff().getKmRate();
    this.baseFee = transit.getTariff().getBaseFee();
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
