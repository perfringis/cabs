import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Claim } from './Claim';

@Entity({ name: 'claim_attachment' })
export class ClaimAttachment extends BaseEntity {
  @Column({ name: 'creation_date', nullable: false, type: 'bigint' })
  private creationDate: number;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  private description: string | null;

  @Column({ nullable: true, type: 'blob' })
  private data: Buffer | null;

  @ManyToOne(() => Claim, (claim) => claim)
  @JoinColumn({ name: 'claim_id' })
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
