import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne, VersionColumn } from 'typeorm';
import { Contract } from './Contract';

export enum ContractAttachmentStatus {
  PROPOSED = 'proposed',
  ACCEPTED_BY_ONE_SIDE = 'accepted_by_one_side',
  ACCEPTED_BY_BOTH_SIDES = 'accepted_by_both_side',
  REJECTED = 'rejected',
}

@Entity({ name: 'contract_attachment' })
export class ContractAttachment extends BaseEntity {
  @Column({ nullable: true, type: 'blob', name: 'data' })
  private data: Buffer | null;

  @Column({
    name: 'creation_date',
    nullable: false,
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  private creationDate: Date;

  @Column({ name: 'accepted_at', nullable: true, type: 'datetime' })
  private acceptedAt: Date | null;

  @Column({ name: 'rejected_at', nullable: true, type: 'datetime' })
  private rejectedAt: Date | null;

  @Column({ name: 'change_date', nullable: true, type: 'datetime' })
  private changeDate: Date | null;

  @Column({
    nullable: true,
    type: 'enum',
    enum: ContractAttachmentStatus,
    default: ContractAttachmentStatus.PROPOSED,
  })
  private status: ContractAttachmentStatus | null;

  @ManyToOne(() => Contract, (contract) => contract.attachments)
  @JoinColumn({ name: 'contract_id' })
  public contract: Contract;

  @VersionColumn({ type: 'int', nullable: true })
  private version: number | null;

  public getData(): Buffer | null {
    return this.data;
  }

  public setData(data: Buffer | null): void {
    this.data = data;
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }

  public setCreationDate(creationDate: Date): void {
    this.creationDate = creationDate;
  }

  public getAcceptedAt(): Date | null {
    return this.acceptedAt;
  }

  public setAcceptedAt(acceptedAt: Date | null): void {
    this.acceptedAt = acceptedAt;
  }

  public getRejectedAt(): Date | null {
    return this.rejectedAt;
  }

  public setRejectedAt(rejectedAt: Date | null): void {
    this.rejectedAt = rejectedAt;
  }

  public getChangeDate(): Date | null {
    return this.changeDate;
  }

  public setChangeDate(changeDate: Date | null): void {
    this.changeDate = changeDate;
  }

  public getStatus(): ContractAttachmentStatus | null {
    return this.status;
  }

  public setStatus(status: ContractAttachmentStatus | null): void {
    this.status = status;
  }

  public getContract(): Contract {
    return this.contract;
  }

  public setContract(contract: Contract): void {
    this.contract = contract;
  }
}
