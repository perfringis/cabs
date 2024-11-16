import { ForbiddenException } from '@nestjs/common';
import { BaseEntity } from 'src/common/BaseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  VersionColumn,
} from 'typeorm';
import { Address } from './Address';
import { CarClass } from './CarType';
import { Client, PaymentType } from './Client';
import { Driver } from './Driver';
import { Money } from './Money';
import { Distance } from './Distance';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Tariff } from './Tariff';

dayjs.extend(utc);

export enum Status {
  DRAFT = 'draft',
  CANCELLED = 'cancelled',
  WAITING_FOR_DRIVER_ASSIGNMENT = 'waiting_for_driver_assignment',
  DRIVER_ASSIGNMENT_FAILED = 'driver_assignment_failed',
  TRANSIT_TO_PASSENGER = 'transit_to_passenger',
  IN_TRANSIT = 'in_transit',
  COMPLETED = 'completed',
}

export enum DriverPaymentStatus {
  NOT_PAID = 'not_paid',
  PAID = 'paid',
  CLAIMED = 'claimed',
  RETURNED = 'returned',
}

export enum ClientPaymentStatus {
  NOT_PAID = 'not_paid',
  PAID = 'paid',
  RETURNED = 'returned',
}

export enum Month {
  JANUARY,
  FEBRUARY,
  MARCH,
  APRIL,
  MAY,
  JUNE,
  JULY,
  AUGUST,
  SEPTEMBER,
  OCTOBER,
  NOVEMBER,
  DECEMBER,
}

export enum DayOfWeek {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}

@Entity({ name: 'transit' })
export class Transit extends BaseEntity {
  @Column({
    name: 'driver_payment_status',
    nullable: true,
    type: 'enum',
    enum: DriverPaymentStatus,
  })
  private driverPaymentStatus: DriverPaymentStatus | null;

  @Column({
    name: 'client_payment_status',
    nullable: true,
    type: 'enum',
    enum: ClientPaymentStatus,
  })
  private clientPaymentStatus: ClientPaymentStatus | null;

  @Column({
    name: 'payment_type',
    nullable: true,
    type: 'enum',
    enum: PaymentType,
  })
  private paymentType: PaymentType | null;

  @Column({ nullable: true, type: 'enum', enum: Status })
  public status: Status | null;

  @Column({ nullable: true, type: 'datetime' })
  private date: Date | null;

  @Column({ name: 'pickup_address_change_counter', nullable: true, default: 0 })
  private pickupAddressChangeCounter: number | null;

  @Column({ name: 'accepted_at', nullable: true, type: 'datetime' })
  private acceptedAt: Date | null;

  @Column({ nullable: true, type: 'datetime' })
  private started: Date | null;

  @Column({
    name: 'awaiting_drivers_responses',
    type: 'int',
    nullable: true,
    default: 0,
  })
  public awaitingDriversResponses: number | null;

  @Column(() => Tariff, {
    prefix: true,
  })
  public tariff: Tariff;

  @Column({ name: 'km', nullable: false, type: 'float', default: 0 })
  private km: number;

  // https://stackoverflow.com/questions/37107123/sould-i-store-price-as-decimal-or-integer-in-mysql
  @Column(() => Money, {
    prefix: true,
  })
  private price: Money | null;

  @Column(() => Money, {
    prefix: true,
  })
  private estimatedPrice: Money | null;

  @Column(() => Money, {
    prefix: true,
  })
  private driversFee: Money | null;

  @Column({ name: 'date_time', nullable: true, type: 'datetime' })
  public dateTime: Date | null;

  @Column({ nullable: true, type: 'datetime' })
  public published: Date | null;

  @Column({ name: 'complete_at', nullable: true, type: 'datetime' })
  private completeAt: Date | null;

  @Column({ name: 'car_type', nullable: true, type: 'enum', enum: CarClass })
  private carType: CarClass;

  @VersionColumn({ type: 'int', nullable: true })
  private version: number | null;

  @ManyToOne(() => Address, (address) => address.transits, { eager: true })
  @JoinColumn({ name: 'from_id' })
  public from: Address;

  @ManyToOne(() => Address, (address) => address.transits, { eager: true })
  @JoinColumn({ name: 'to_id' })
  public to: Address;

  @ManyToOne(() => Driver, (driver) => driver.transits, {
    eager: true,
  })
  @JoinColumn({ name: 'driver_id' })
  public driver: Driver;

  @ManyToOne(() => Client, (client) => client.transits, { eager: true })
  @JoinColumn({ name: 'client_id' })
  public client: Client;

  @ManyToMany(() => Driver, (driver) => driver.transits, { eager: true })
  @JoinTable({
    name: 'transit_drivers_rejections',
    joinColumn: { name: 'transit_id' },
    inverseJoinColumn: { name: 'drivers_rejections_id' },
  })
  public driversRejections: Driver[];

  @ManyToMany(() => Driver, (driver) => driver.transits, { eager: true })
  @JoinTable({
    name: 'transit_proposed_drivers',
    joinColumn: { name: 'transit_id' },
    inverseJoinColumn: { name: 'proposed_drivers_id' },
  })
  public proposedDrivers: Driver[];

  public getDriverPaymentStatus(): DriverPaymentStatus | null {
    return this.driverPaymentStatus;
  }

  public setDriverPaymentStatus(
    driverPaymentStatus: DriverPaymentStatus,
  ): void {
    this.driverPaymentStatus = driverPaymentStatus;
  }

  public getClientPaymentStatus(): ClientPaymentStatus | null {
    return this.clientPaymentStatus;
  }

  public setClientPaymentStatus(
    clientPaymentStatus: ClientPaymentStatus,
  ): void {
    this.clientPaymentStatus = clientPaymentStatus;
  }

  public getPaymentType(): PaymentType | null {
    return this.paymentType;
  }

  public setPaymentType(paymentType: PaymentType): void {
    this.paymentType = paymentType;
  }

  public getStatus(): Status | null {
    return this.status;
  }

  public setStatus(status: Status): void {
    this.status = status;
  }

  public getDate(): Date | null {
    return this.date;
  }

  public setDate(date: Date): void {
    this.date = date;
  }

  public getPickupAddressChangeCounter(): number | null {
    return this.pickupAddressChangeCounter;
  }

  public setPickupAddressChangeCounter(
    pickupAddressChangeCounter: number,
  ): void {
    this.pickupAddressChangeCounter = pickupAddressChangeCounter;
  }

  public getAcceptedAt(): Date | null {
    return this.acceptedAt;
  }

  public setAcceptedAt(acceptedAt: Date): void {
    this.acceptedAt = acceptedAt;
  }

  public getStarted(): Date | null {
    return this.started;
  }

  public setStarted(started: Date): void {
    this.started = started;
  }

  public getAwaitingDriversResponses(): number | null {
    return this.awaitingDriversResponses;
  }

  public setAwaitingDriversResponses(awaitingDriversResponses: number): void {
    this.awaitingDriversResponses = awaitingDriversResponses;
  }

  public getKm(): Distance {
    return Distance.ofKm(this.km);
  }

  public setKm(distance: Distance): void {
    this.km = distance.toKmInFloat();
    this.estimateCost();
  }

  public getPrice(): Money | null {
    return this.price;
  }

  //just for testing
  public setPrice(price: Money): void {
    this.price = price;
  }

  public getEstimatedPrice(): Money | null {
    return this.estimatedPrice;
  }

  public setEstimatedPrice(estimatedPrice: Money): void {
    this.estimatedPrice = estimatedPrice;
  }

  public getDriversFee(): Money | null {
    return this.driversFee;
  }

  public setDriversFee(driversFee: Money): void {
    this.driversFee = driversFee;
  }

  public getDateTime(): Date | null {
    return this.dateTime;
  }

  public setDateTime(dateTime: Date): void {
    this.tariff = Tariff.ofTime(dateTime);
    this.dateTime = dateTime;
  }

  public getPublished(): Date | null {
    return this.published;
  }

  public setPublished(published: Date): void {
    this.published = published;
  }

  public getCarType(): CarClass {
    return this.carType;
  }

  public setCarType(carType: CarClass): void {
    this.carType = carType;
  }

  public getFrom(): Address {
    return this.from;
  }

  public setFrom(from: Address): void {
    this.from = from;
  }

  public getTo(): Address {
    return this.to;
  }

  public setTo(to: Address): void {
    this.to = to;
  }

  public getDriver(): Driver {
    return this.driver;
  }

  public setDriver(driver: Driver): void {
    this.driver = driver;
  }

  public getClient(): Client {
    return this.client;
  }

  public setClient(client: Client): void {
    this.client = client;
  }

  public getDriversRejections(): Driver[] {
    return this.driversRejections;
  }

  public setDriversRejections(driversRejections: Driver[]): void {
    this.driversRejections = driversRejections;
  }

  public getProposedDrivers(): Driver[] {
    return this.proposedDrivers;
  }

  public setProposedDrivers(proposedDrivers: Driver[]): void {
    this.proposedDrivers = proposedDrivers;
  }

  public getCompleteAt(): Date | null {
    return this.completeAt;
  }

  public setCompleteAt(completeAt: Date | null): void {
    this.completeAt = completeAt;
  }

  getTariff(): Tariff {
    return this.tariff;
  }

  public estimateCost(): Money {
    if (this.status === Status.COMPLETED) {
      throw new ForbiddenException(
        `Estimating cost for completed transit is forbidden, id = ${this.getId()}`,
      );
    }

    const estimated: Money = this.calculateCost();

    this.estimatedPrice = estimated;
    this.price = null;

    return this.estimatedPrice;
  }

  public calculateFinalCosts(): Money {
    if (this.status === Status.COMPLETED) {
      return this.calculateCost();
    } else {
      throw new ForbiddenException(
        'Cannot calculate final cost if the transit is not completed',
      );
    }
  }

  private calculateCost(): Money {
    return this.tariff.calculateCost(this.getKm());
  }
}
