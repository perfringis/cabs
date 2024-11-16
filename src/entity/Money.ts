import { Column } from 'typeorm';

export class Money {
  public static readonly ZERO: Money = new Money(0);

  @Column({
    name: '_value',
    nullable: true,
    type: 'int',
  })
  private value: number;

  constructor(value: number) {
    this.value = value;
  }

  public add(other: Money): Money | null {
    return new Money(this.value + other.value);
  }

  public subtract(other: Money): Money | null {
    return new Money(this.value - other.value);
  }

  public percentage(percentage: number): Money | null {
    return new Money(Math.round((percentage * this.value) / 100));
  }

  public toInt(): number {
    return this.value;
  }

  public equals(other: Money): boolean {
    return this.value === other.value;
  }

  public toString() {
    const value = this.value / 100;
    return value.toFixed(2);
  }
}
