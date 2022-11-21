import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Claim } from './Claim';

@Entity()
export class ClaimAttachment extends BaseEntity {
  @Column({ nullable: false, type: 'bigint' })
  private creationDate: number;

  @Column({ nullable: true, type: 'varchar' })
  private description: string | null;

  @Column({ nullable: true, type: 'bytea', name: 'data' })
  private data: Buffer | null;

  @ManyToOne(() => Claim)
  private claim: Claim;

  public getClaim(): Claim {
    return this.claim;
  }

  public setClaim(claim: Claim): void {
    this.claim = claim;
  }

  public getCreationDate(): number {
    return this.creationDate;
  }

  public setCreationDate(creationDate: number): void {
    this.creationDate = creationDate;
  }

  public getDescription(): string | null {
    return this.description;
  }

  public setDescription(description: string | null): void {
    this.description = description;
  }

  public getData(): Buffer | null {
    return this.data;
  }

  public setData(data: Buffer | null): void {
    this.data = data;
  }
}
