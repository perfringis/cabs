import { Client, ClientType, PaymentType, Type } from 'src/entity/Client';

export class ClientDTO {
  public id: string;
  public type: Type | null;
  public name: string | null;
  public lastName: string | null;
  public defaultPaymentType: PaymentType | null;
  public clientType: ClientType | null;

  constructor(client: Client) {
    this.id = client.getId();
    this.type = client.getType();
    this.name = client.getName();
    this.lastName = client.getLastName();
    this.defaultPaymentType = client.getDefaultPaymentType();
    this.clientType = client.getClientType();
  }

  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

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
}
