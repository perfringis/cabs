import { ForbiddenException, NotAcceptableException } from '@nestjs/common';
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

  constructor(
    from: Address,
    to: Address,
    client: Client,
    carClass: CarClass,
    when: Date,
    distance: Distance,
    status: Status = Status.DRAFT,
  ) {
    super();

    this.from = from;
    this.to = to;
    this.client = client;
    this.carType = carClass;
    this.setDateTime(when);
    this.km = distance ? distance.toKmInFloat() : null;
    this.status = status;
  }

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

  public getDate(): Date | null {
    return this.date;
  }

  public setDate(date: Date): void {
    this.date = date;
  }

  public getAcceptedAt(): Date | null {
    return this.acceptedAt;
  }

  public getStarted(): Date | null {
    return this.started;
  }

  public getAwaitingDriversResponses(): number | null {
    return this.awaitingDriversResponses;
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

  public getCarType(): CarClass {
    return this.carType;
  }

  public setCarType(carType: CarClass): void {
    this.carType = carType;
  }

  public getFrom(): Address {
    return this.from;
  }

  public getTo(): Address {
    return this.to;
  }

  public getDriver(): Driver {
    return this.driver;
  }

  public getClient(): Client {
    return this.client;
  }

  public getProposedDrivers(): Driver[] {
    return this.proposedDrivers;
  }

  public getCompleteAt(): Date | null {
    return this.completeAt;
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

  public start(when: Date): void {
    if (!(this.status === Status.TRANSIT_TO_PASSENGER)) {
      throw new NotAcceptableException(
        'Transit cannot be started, id = ' + this.getId(),
      );
    }

    this.started = when;
    this.status = Status.IN_TRANSIT;
  }

  public rejectBy(driver: Driver): void {
    this.driversRejections.push(driver);
    this.awaitingDriversResponses--;
  }

  public publishAt(when: Date): void {
    this.status = Status.WAITING_FOR_DRIVER_ASSIGNMENT;
    this.published = when;
  }

  public changePickUpTo(
    newAddress: Address,
    newDistance: Distance,
    distanceInKMeters: number,
  ): void {
    if (distanceInKMeters > 0.25) {
      throw new NotAcceptableException(
        "Address 'from' cannot be changed, id = " + this.getId(),
      );
    }

    if (
      !(this.status === Status.DRAFT) &&
      !(this.status === Status.WAITING_FOR_DRIVER_ASSIGNMENT)
    ) {
      throw new NotAcceptableException(
        "Address 'from' cannot be changed, id = " + this.getId(),
      );
    } else if (this.pickupAddressChangeCounter > 2) {
      throw new NotAcceptableException(
        "Address 'from' cannot be changed, id = " + this.getId(),
      );
    }

    this.from = newAddress;
    this.pickupAddressChangeCounter++;
    this.km = newDistance.toKmInFloat();
    this.estimateCost();
  }

  public changeDestinationTo(
    createdNewAddress: Address,
    newDistance: Distance,
  ): void {
    if (this.status === Status.COMPLETED) {
      throw new NotAcceptableException(
        "Address 'to' cannot be changed, id = " + this.getId(),
      );
    }

    this.to = createdNewAddress;
    this.km = newDistance.toKmInFloat();
  }

  public cancel() {
    if (
      ![
        Status.DRAFT,
        Status.WAITING_FOR_DRIVER_ASSIGNMENT,
        Status.TRANSIT_TO_PASSENGER,
      ].includes(this.status)
    ) {
      throw new NotAcceptableException(
        'Transit cannot be cancelled, id = ' + this.getId(),
      );
    }

    this.status = Status.CANCELLED;
    this.driver = null;
    this.km = Distance.ZERO.toKmInFloat();
    this.awaitingDriversResponses = 0;
  }

  public shouldNotWaitForDriverAnyMore(date: Date): boolean {
    return (
      this.status === Status.CANCELLED ||
      dayjs(this.published).add(300, 'second').isBefore(dayjs(date))
    );
  }

  public failDriverAssignment(): void {
    this.status = Status.DRIVER_ASSIGNMENT_FAILED;
    this.driver = null;
    this.km = Distance.ZERO.toKmInFloat();
    this.awaitingDriversResponses = 0;
  }

  public canProposeTo(driver: Driver): boolean {
    return !this._contains(this.driversRejections, driver);
  }

  public proposeTo(driver: Driver): void {
    if (this.canProposeTo(driver)) {
      this.proposedDrivers.push(driver);
      this.awaitingDriversResponses++;
    }
  }

  public acceptBy(driver: Driver, when: Date): void {
    if (this.driver) {
      throw new NotAcceptableException(
        'Transit already accepted, id = ' + this.getId(),
      );
    } else {
      if (!this._contains(this.proposedDrivers, driver)) {
        throw new NotAcceptableException(
          'Driver out of possible drivers, id = ' + this.getId(),
        );
      } else {
        if (this._contains(this.driversRejections, driver)) {
          throw new NotAcceptableException(
            'Driver out of possible drivers, id = ' + this.getId(),
          );
        } else {
          this.driver = driver;
          driver.setIsOccupied(true);
          this.awaitingDriversResponses = 0;
          this.acceptedAt = when;
          this.status = Status.TRANSIT_TO_PASSENGER;
        }
      }
    }
  }

  public setCompleteAt(
    when: Date,
    createdDestinationAddress: Address,
    newDistance: Distance,
  ) {
    if (this.status === Status.IN_TRANSIT) {
      this.km = newDistance.toKmInFloat();
      this.estimateCost();
      this.completeAt = when;
      this.to = createdDestinationAddress;
      this.status = Status.COMPLETED;
      this.calculateFinalCosts();
    } else {
      throw new NotAcceptableException(
        'Cannot complete Transit, id = ' + this.getId(),
      );
    }
  }

  private _contains<T extends BaseEntity>(array: T[], elem: T): boolean {
    return array.map((arrElem) => arrElem.getId()).includes(elem.getId());
  }
}
