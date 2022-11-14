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
  @Column({ nullable: true, type: 'enum', enum: Type })
  private type: Type | null;

  @Column({ nullable: true, type: 'varchar' })
  private name: string | null;

  @Column({ nullable: true, type: 'varchar' })
  private lastName: string | null;

  @Column({ nullable: true, type: 'enum', enum: PaymentType })
  private defaultPaymentType: PaymentType | null;

  @Column({
    nullable: true,
    type: 'enum',
    enum: ClientType,
    default: ClientType.INDIVIDUAL,
  })
  private clientType: ClientType;

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
