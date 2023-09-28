import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne, VersionColumn } from 'typeorm';
import { Claim } from './Claim';

@Entity({ name: 'claim_attachment' })
export class ClaimAttachment extends BaseEntity {
  @Column({ name: 'creation_date', nullable: false, type: 'datetime' })
  private creationDate: Date;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  private description: string | null;

  @Column({ nullable: true, type: 'blob' })
  private data: Buffer | null;

  @ManyToOne(() => Claim, (claim) => claim)
  @JoinColumn({ name: 'claim_id' })
  private claim: Claim;

  @VersionColumn({ type: 'int', nullable: true })
  private version: number | null;

  public getCreationDate(): Date {
    return this.creationDate;
  }

  public setCreationDate(creationDate: Date): void {
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

  public getClaim(): Claim {
    return this.claim;
  }

  public setClaim(claim: Claim): void {
    this.claim = claim;
  }
}
