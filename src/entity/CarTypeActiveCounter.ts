import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CarClass } from './CarType';
import objectHash from 'object-hash';

@Entity({
  name: 'car_type_active_counter',
})
export class CarTypeActiveCounter {
  @PrimaryColumn({
    name: 'car_class',
    nullable: false,
    type: 'enum',
    enum: CarClass,
  })
  public carClass: CarClass;

  @Column({
    name: 'active_cars_counter',
    nullable: false,
    type: 'int',
    default: 0,
  })
  private activeCarsCounter: number;

  constructor(carClass?: CarClass) {
    if (carClass) {
      this.carClass = carClass;
    }
  }

  public getActiveCarsCounter(): number {
    return this.activeCarsCounter;
  }

  public hashCode(): string {
    return objectHash({
      carClass: this.carClass,
      activeCarsCounter: this.activeCarsCounter,
    });
  }

  public getCarClass(): CarClass {
    return this.carClass;
  }
}
