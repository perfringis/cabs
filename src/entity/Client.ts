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

@Entity()
export class Client {
  @Column({ type: 'enum', enum: Type })
  private type: Type;

  @Column()
  private name: string;

  @Column()
  private lastName: string;

  @Column({ type: 'enum', enum: PaymentType })
  private defaultPaymentType: PaymentType;

  @Column({ type: 'enum', enum: ClientType, default: ClientType.INDIVIDUAL })
  private clientType: ClientType;

  @OneToMany(() => Claim, (claim) => claim.owner)
  public claims: Claim[];

  public getType(): Type {
    return this.type;
  }

  public setType(type: Type): void {
    this.type = type;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public setLastName(lastName: string): void {
    this.lastName = lastName;
  }

  public getDefaultPaymentType(): PaymentType {
    return this.defaultPaymentType;
  }

  public setDefaultPaymentType(defaultPaymentType: PaymentType): void {
    this.defaultPaymentType = defaultPaymentType;
  }

  public getClientType(): ClientType {
    return this.clientType;
  }

  public setClientType(clientType: ClientType): void {
    this.clientType = clientType;
  }

  public getClaims(): Claim[] {
    return this.claims;
  }

  public setClaims(claims: Claim[]): void {
    this.claims = claims;
  }
}
