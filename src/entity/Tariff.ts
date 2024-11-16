import { Column } from 'typeorm';
import { Distance } from './Distance';
import { Money } from './Money';
import { DayOfWeek, Month } from './Transit';
import dayjs from 'dayjs';

export class Tariff {
  private static readonly BASE_FEE: number = 8;

  @Column({ name: '_km_rate', nullable: true, type: 'float' })
  private kmRate: number;

  @Column({ name: '_name', nullable: true, type: 'varchar', length: 255 })
  private name: string;

  @Column({ name: '_base_fee', nullable: true, type: 'int' })
  private baseFee: number;

  public static ofTime(dateTime: Date): Tariff {
    const day = dayjs(dateTime);
    const month = day.month();
    const dayOfMonth = day.date();
    const hour = day.hour();
    const dayOfWeek = day.day();

    if (
      (month === Month.DECEMBER && dayOfMonth === 31) ||
      (month === Month.JANUARY && dayOfMonth === 1 && hour <= 6)
    ) {
      return new Tariff(3.5, 'Sylwester', Tariff.BASE_FEE + 3);
    } else {
      // piątek i sobota po 17 do 6 następnego dnia
      if (
        (dayOfWeek === DayOfWeek.FRIDAY && hour >= 17) ||
        (dayOfWeek === DayOfWeek.SATURDAY && hour <= 6) ||
        (dayOfWeek === DayOfWeek.SATURDAY && hour >= 17) ||
        (dayOfWeek === DayOfWeek.SUNDAY && hour <= 6)
      ) {
        return new Tariff(2.5, 'Weekend+', Tariff.BASE_FEE + 2);
      } else {
        // pozostałe godziny weekendu
        if (
          (dayOfWeek === DayOfWeek.SATURDAY && hour > 6 && hour < 17) ||
          (dayOfWeek === DayOfWeek.SUNDAY && hour > 6)
        ) {
          return new Tariff(1.5, 'Weekend', Tariff.BASE_FEE);
        } else {
          // tydzień roboczy
          return new Tariff(1.0, 'Standard', Tariff.BASE_FEE + 1);
        }
      }
    }
  }

  private constructor(kmRate: number, name: string, baseFee: number) {
    this.kmRate = kmRate;
    this.name = name;
    this.baseFee = baseFee;
  }

  public calculateCost(distance: Distance): Money {
    const priceBigDecimal: number = parseInt(
      (distance.toKmInFloat() * this.kmRate + this.baseFee).toFixed(2),
      10,
    );

    const finalPrice: number = parseInt(
      priceBigDecimal.toString().replace(/\./gi, ''),
      10,
    );

    return new Money(finalPrice);
  }

  public getKmRate(): number {
    return this.kmRate;
  }

  public getName() {
    return this.name;
  }

  getBaseFee(): number {
    return this.baseFee;
  }
}
