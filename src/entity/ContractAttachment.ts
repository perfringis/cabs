import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
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
    type: 'bigint',
    default: Date.now(),
  })
  private creationDate: number;

  @Column({ name: 'accepted_at', nullable: true, type: 'bigint' })
  private acceptedAt: number | null;

  @Column({ name: 'rejected_at', nullable: true, type: 'bigint' })
  private rejectedAt: number | null;

  @Column({ name: 'change_date', nullable: true, type: 'bigint' })
  private changeDate: number | null;

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

  public getData(): Buffer | null {
    return this.data;
  }

  public setData(data: Buffer | null): void {
    this.data = data;
  }

  public getCreationDate(): number {
    return this.creationDate;
  }

  public setCreationDate(creationDate: number): void {
    this.creationDate = creationDate;
  }

  public getAcceptedAt(): number | null {
    return this.acceptedAt;
  }

  public setAcceptedAt(acceptedAt: number | null): void {
    this.acceptedAt = acceptedAt;
  }

  public getRejectedAt(): number | null {
    return this.rejectedAt;
  }

  public setRejectedAt(rejectedAt: number | null): void {
    this.rejectedAt = rejectedAt;
  }

  public getChangeDate(): number | null {
    return this.changeDate;
  }

  public setChangeDate(changeDate: number | null): void {
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
