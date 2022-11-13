import { PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  protected id: number;

  public getId(): number {
    return this.id;
  }
}
