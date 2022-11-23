import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ContractAttachment } from './ContractAttachment';

export enum ContractStatus {
  NEGOTIATIONS_IN_PROGRESS = 'negotiations_in_progress',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
}

@Entity({ name: 'contract' })
export class Contract extends BaseEntity {
  @Column({
    name: 'partner_name',
    nullable: true,
    type: 'varchar',
    length: 255,
  })
  private partnerName: string | null;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  private subject: string | null;

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
    nullable: false,
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.NEGOTIATIONS_IN_PROGRESS,
  })
  private status: ContractStatus;

  @Column({
    name: 'contract_no',
    nullable: false,
    type: 'varchar',
    length: 255,
  })
  private contractNo: string;

  @OneToMany(
    () => ContractAttachment,
    (contractAttachment) => contractAttachment.contract,
    { eager: true },
  )
  // public attachments: ContractAttachment[];
  public attachments: Set<ContractAttachment>;

  public getPartnerName(): string | null {
    return this.partnerName;
  }

  public setPartnerName(partnerName: string | null): void {
    this.partnerName = partnerName;
  }

  public getSubject(): string | null {
    return this.subject;
  }

  public setSubject(subject: string | null): void {
    this.subject = subject;
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

  public getStatus(): ContractStatus {
    return this.status;
  }

  public setStatus(status: ContractStatus): void {
    this.status = status;
  }

  public getContractNo(): string {
    return this.contractNo;
  }

  public setContractNo(contractNo: string): void {
    this.contractNo = contractNo;
  }

  public getAttachments(): Set<ContractAttachment> {
    return this.attachments;
  }

  public setAttachments(attachments: Set<ContractAttachment>): void {
    this.attachments = attachments;
  }
}
