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
  public static readonly BASE_FEE: number = 8;

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

  @Column({ nullable: true, type: 'int' })
  public factor: number | null;

  @Column({ nullable: false, type: 'float', default: 0 })
  private km: number;

  // https://stackoverflow.com/questions/37107123/sould-i-store-price-as-decimal-or-integer-in-mysql
  @Column(() => Money, {
    prefix: true,
  })
  private price: Money | null;

  @Column({ name: 'estimated_price', nullable: true, type: 'int' })
  private estimatedPrice: number | null;

  @Column({ name: 'drivers_fee', nullable: true, type: 'int' })
  private driversFee: number | null;

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

  public getKm(): number {
    return this.km;
  }

  public setKm(km: number): void {
    this.km = km;
    this.estimateCost();
  }

  public getPrice(): Money | null {
    return this.price;
  }

  //just for testing
  public setPrice(price: Money): void {
    this.price = price;
  }

  public getEstimatedPrice(): number | null {
    return this.estimatedPrice;
  }

  public setEstimatedPrice(estimatedPrice: number): void {
    this.estimatedPrice = estimatedPrice;
  }

  public getDriversFee(): number | null {
    return this.driversFee;
  }

  public setDriversFee(driversFee: number): void {
    this.driversFee = driversFee;
  }

  public getDateTime(): Date | null {
    return this.dateTime;
  }

  public setDateTime(dateTime: Date): void {
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

  public estimateCost(): number {
    if (this.status === Status.COMPLETED) {
      throw new ForbiddenException(
        `Estimating cost for completed transit is forbidden, id = ${this.getId()}`,
      );
    }

    const estimated: Money = this.calculateCost();

    this.estimatedPrice = estimated.toInt();
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
    let baseFee = Transit.BASE_FEE;
    let factorToCalculate = this.factor;
    if (factorToCalculate == null) {
      factorToCalculate = 1;
    }
    let kmRate: number;
    const day = new Date();
    // wprowadzenie nowych cennikow od 1.01.2019
    if (day.getFullYear() <= 2018) {
      kmRate = 1.0;
      baseFee++;
    } else {
      if (
        (day.getMonth() == Month.DECEMBER && day.getDate() == 31) ||
        (day.getMonth() == Month.JANUARY &&
          day.getDate() == 1 &&
          day.getHours() <= 6)
      ) {
        kmRate = 3.5;
        baseFee += 3;
      } else {
        // piątek i sobota po 17 do 6 następnego dnia
        if (
          (day.getDay() == DayOfWeek.FRIDAY && day.getHours() >= 17) ||
          (day.getDay() == DayOfWeek.SATURDAY && day.getHours() <= 6) ||
          (day.getDay() == DayOfWeek.SATURDAY && day.getHours() >= 17) ||
          (day.getDay() == DayOfWeek.SUNDAY && day.getHours() <= 6)
        ) {
          kmRate = 2.5;
          baseFee += 2;
        } else {
          // pozostałe godziny weekendu
          if (
            (day.getDay() == DayOfWeek.SATURDAY &&
              day.getHours() > 6 &&
              day.getHours() < 17) ||
            (day.getDay() == DayOfWeek.SUNDAY && day.getHours() > 6)
          ) {
            kmRate = 1.5;
          } else {
            // tydzień roboczy
            kmRate = 1.0;
            baseFee++;
          }
        }
      }
    }
    const priceBigDecimal = Number(
      (this.km * kmRate * factorToCalculate + baseFee).toFixed(2),
    );
    this.price = new Money(priceBigDecimal);
    return this.price;
  }
}
