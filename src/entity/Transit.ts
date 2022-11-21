import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { Address } from './Address';
import { CarClass } from './CarType';
import { Client, PaymentType } from './Client';
import { Driver } from './Driver';

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

@Entity()
export class Transit extends BaseEntity {
  public static readonly BASE_FEE: number = 8;

  @Column({ nullable: true, type: 'enum', enum: DriverPaymentStatus })
  private driverPaymentStatus: DriverPaymentStatus | null;

  @Column({ nullable: true, type: 'enum', enum: ClientPaymentStatus })
  private clientPaymentStatus: ClientPaymentStatus | null;

  @Column({ nullable: true, type: 'enum', enum: PaymentType })
  private paymentType: PaymentType | null;

  @Column({ nullable: true, type: 'enum', enum: Status })
  private status: Status | null;

  @Column({ nullable: true, type: 'bigint' })
  private date: number | null;

  @ManyToOne(() => Address, (address) => address, { eager: true })
  @JoinColumn()
  private from: Address;

  @ManyToOne(() => Address, (address) => address, { eager: true })
  @JoinColumn()
  private to: Address;

  @Column({ nullable: true, default: 0 })
  private pickupAddressChangeCounter: number | null;

  // @ManyToOne(() => Driver, (driver) => driver.transits, { eager: true })
  // public driver: Driver;

  @Column({ nullable: true, type: 'bigint' })
  private acceptedAt: number | null;

  @Column({ nullable: true, type: 'bigint' })
  private started: number | null;

  @ManyToMany(() => Driver, (driver) => driver)
  private driversRejections: Set<Driver>;

  @ManyToMany(() => Driver, (driver) => driver)
  private proposedDrivers: Set<Driver>;

  @Column({ nullable: true, default: 0 })
  private awaitingDriversResponses: number | null;

  @Column({ nullable: true })
  private factor: number | null;

  @Column({ nullable: true, type: 'float' })
  private km: number | null;

  @Column({ nullable: true })
  private price: number | null;

  @Column({ nullable: true })
  private estimatedPrice: number | null;

  @Column({ nullable: true })
  private driversFee: number | null;

  @Column({ nullable: true, type: 'bigint' })
  private dateTime: number | null;

  @Column({ nullable: true, type: 'bigint' })
  private published: number | null;

  @ManyToOne(() => Client, (client) => client, { eager: true })
  @JoinColumn()
  private client: Client;

  @Column({ nullable: true, type: 'enum', enum: CarClass })
  private carType: CarClass;
}
