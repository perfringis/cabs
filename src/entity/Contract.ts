import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, OneToMany, VersionColumn } from 'typeorm';
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
  public partnerName: string | null;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  private subject: string | null;

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
  public attachments: ContractAttachment[];

  @VersionColumn({ type: 'int', nullable: true })
  private version: number | null;

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

  public getAttachments(): ContractAttachment[] {
    return this.attachments;
  }

  public setAttachments(attachments: ContractAttachment[]): void {
    this.attachments = attachments;
  }
}
