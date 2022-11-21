import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'invoice' })
export class Invoice extends BaseEntity {
  @Column({ nullable: true, type: 'decimal', precision: 19, scale: 2 })
  private amount: number | null;

  @Column({
    name: 'subject_name',
    nullable: true,
    type: 'varchar',
    length: 255,
  })
  private subjectName: string | null;

  public getAmount(): number | null {
    return this.amount;
  }

  public setAmount(amount: number | null): void {
    this.amount = amount;
  }

  public getSubjectName(): string | null {
    return this.subjectName;
  }

  public setSubjectName(subjectName: string | null): void {
    this.subjectName = subjectName;
  }
}
