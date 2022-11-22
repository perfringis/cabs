import { BaseEntity } from 'src/common/BaseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
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
  private status: Status | null;

  @Column({ nullable: true, type: 'bigint' })
  private date: number | null;

  @Column({ name: 'pickup_address_change_counter', nullable: true, default: 0 })
  private pickupAddressChangeCounter: number | null;

  @Column({ name: 'accepted_at', nullable: true, type: 'bigint' })
  private acceptedAt: number | null;

  @Column({ nullable: true, type: 'bigint' })
  private started: number | null;

  @Column({
    name: 'awaiting_drivers_responses',
    type: 'int',
    nullable: true,
    default: 0,
  })
  private awaitingDriversResponses: number | null;

  @Column({ nullable: true, type: 'int' })
  private factor: number | null;

  @Column({ nullable: false, type: 'float' })
  private km: number;

  @Column({ nullable: true, type: 'int' })
  private price: number | null;

  @Column({ name: 'estimated_price', nullable: true, type: 'int' })
  private estimatedPrice: number | null;

  @Column({ name: 'drivers_fee', nullable: true, type: 'int' })
  private driversFee: number | null;

  @Column({ name: 'date_time', nullable: true, type: 'bigint' })
  private dateTime: number | null;

  @Column({ nullable: true, type: 'bigint' })
  private published: number | null;

  @Column({ name: 'car_type', nullable: true, type: 'enum', enum: CarClass })
  private carType: CarClass;

  @ManyToOne(() => Address, (address) => address, { eager: true })
  @JoinColumn({ name: 'from_id' })
  private from: Address;

  @ManyToOne(() => Address, (address) => address, { eager: true })
  @JoinColumn({ name: 'to_id' })
  private to: Address;

  @ManyToOne(() => Driver, (driver) => driver.transits, { eager: true })
  @JoinColumn({ name: 'driver_id' })
  public driver: Driver;

  @ManyToOne(() => Client, (client) => client, { eager: true })
  @JoinColumn({ name: 'client_id' })
  private client: Client;

  @ManyToMany(() => Driver, (driver) => driver)
  @JoinTable({
    name: 'transit_drivers_rejections',
    joinColumn: { name: 'transit_id' },
    inverseJoinColumn: { name: 'drivers_rejections_id' },
  })
  private driversRejections: Set<Driver>;

  @ManyToMany(() => Driver, (driver) => driver)
  @JoinTable({
    name: 'transit_proposed_drivers',
    joinColumn: { name: 'transit_id' },
    inverseJoinColumn: { name: 'proposed_drivers_id' },
  })
  private proposedDrivers: Set<Driver>;
}
