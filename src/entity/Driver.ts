import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { DriverAttribute } from './DriverAttribute';
import { DriverFee } from './DriverFee';
import { Transit } from './Transit';

export enum DriverStatus {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
}

export enum DriverType {
  CANDIDATE = 'candidate',
  REGULAR = 'regular',
}

@Entity()
export class Driver extends BaseEntity {
  @Column({ nullable: true, type: 'enum', enum: DriverType })
  private type: DriverType | null;

  @Column({ nullable: false, type: 'enum', enum: DriverStatus })
  private status: DriverStatus;

  @Column({ name: 'first_name', nullable: true, type: 'varchar', length: 255 })
  private firstName: string | null;

  @Column({ name: 'last_name', nullable: true, type: 'varchar', length: 255 })
  private lastName: string | null;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  private photo: string | null;

  @Column({
    name: 'driver_license',
    nullable: false,
    type: 'varchar',
    length: 255,
  })
  private driverLicense: string;

  @Column({ name: 'is_occupied', nullable: false, type: 'boolean' })
  private isOccupied: boolean;

  @OneToOne(() => DriverFee, (driverFee) => driverFee.driver)
  @JoinColumn({ name: 'fee_id' })
  public fee: DriverFee;

  @OneToMany(() => DriverAttribute, (driverAttribute) => driverAttribute.driver)
  // public attributes: DriverAttribute[];
  public attributes: Set<DriverAttribute>;

  // @OneToMany(() => Transit, (transit) => transit.driver)
  // public transits: Transit[];
}
