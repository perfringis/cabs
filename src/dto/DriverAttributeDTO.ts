import objectHash from 'object-hash';

import {
  DriverAttribute,
  DriverAttributeName,
} from 'src/entity/DriverAttribute';

export class DriverAttributeDTO {
  public name: DriverAttributeName;
  public value: string;

  constructor(
    a:
      | DriverAttribute
      | {
          name: DriverAttributeName;
          value: string;
        },
  ) {
    if (a instanceof DriverAttribute) {
      this.name = a.getName();
      this.value = a.getValue();
    } else {
      this.name = a.name;
      this.value = a.value;
    }
  }

  public getName(): DriverAttributeName {
    return this.name;
  }

  public setName(name: DriverAttributeName): void {
    this.name = name;
  }

  public getValue(): string {
    return this.value;
  }

  public setValue(value: string): void {
    this.value = value;
  }

  public hashCode(): string {
    return objectHash({ name: this.name, value: this.value });
  }
}
