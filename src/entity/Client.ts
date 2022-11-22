import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Claim } from './Claim';

export enum Type {
  NORMAL = 'normal',
  VIP = 'vip',
}

export enum PaymentType {
  PRE_PAID = 'pre_paid',
  POST_PAID = 'post_paid',
  MONTHLY_INVOICE = 'monthly_invoice',
}

export enum ClientType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

@Entity({ name: 'client' })
export class Client extends BaseEntity {
  @Column({ nullable: true, type: 'enum', enum: Type })
  private type: Type | null;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  private name: string | null;

  @Column({ name: 'last_name', nullable: true, type: 'varchar', length: 255 })
  private lastName: string | null;

  @Column({
    name: 'default_payment_type',
    nullable: true,
    type: 'enum',
    enum: PaymentType,
  })
  private defaultPaymentType: PaymentType | null;

  @Column({
    name: 'client_type',
    nullable: true,
    type: 'enum',
    enum: ClientType,
  })
  private clientType: ClientType | null;

  @OneToMany(() => Claim, (claim) => claim.owner)
  public claims: Claim[];

  public getType(): Type | null {
    return this.type;
  }

  public setType(type: Type | null): void {
    this.type = type;
  }

  public getName(): string | null {
    return this.name;
  }

  public setName(name: string | null): void {
    this.name = name;
  }

  public getLastName(): string | null {
    return this.lastName;
  }

  public setLastName(lastName: string | null): void {
    this.lastName = lastName;
  }

  public getDefaultPaymentType(): PaymentType | null {
    return this.defaultPaymentType;
  }

  public setDefaultPaymentType(defaultPaymentType: PaymentType | null): void {
    this.defaultPaymentType = defaultPaymentType;
  }

  public getClientType(): ClientType | null {
    return this.clientType;
  }

  public setClientType(clientType: ClientType | null): void {
    this.clientType = clientType;
  }

  public getClaims(): Claim[] {
    return this.claims;
  }

  public setClaims(claims: Claim[]): void {
    this.claims = claims;
  }
}
