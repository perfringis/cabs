import { BaseEntity } from 'src/common/BaseEntity';
import { Column, JoinColumn, OneToMany, OneToOne } from 'typeorm';
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

export class Driver extends BaseEntity {
  @Column({ nullable: true, type: 'enum', enum: DriverType })
  private type: DriverType | null;

  @Column({ nullable: false, type: 'enum', enum: DriverStatus })
  private status: DriverStatus;

  @Column({ nullable: true, type: 'varchar' })
  private firstName: string | null;

  @Column({ nullable: true, type: 'varchar' })
  private lastName: string | null;

  @Column({ nullable: true, type: 'varchar' })
  private photo: string | null;

  @Column({ nullable: false, type: 'varchar' })
  private driverLicense: string;

  @OneToOne(() => DriverFee, (fee) => fee.driver)
  @JoinColumn()
  public fee: DriverFee; // create feeId column

  @Column({ nullable: true, type: 'boolean' })
  private isOccupied: boolean | null;

  @OneToMany(() => DriverAttribute, (driverAttribute) => driverAttribute.driver)
  public attributes: DriverAttribute[];

  @OneToMany(() => Transit, (transit) => transit.driver)
  public transits: Transit[];
  
}
