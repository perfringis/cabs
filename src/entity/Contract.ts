import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ContractAttachment } from './ContractAttachment';

export enum ContractStatus {
  NEGOTIATIONS_IN_PROGRESS = 'negotiations_in_progress',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
}

@Entity()
export class Contract extends BaseEntity {
  @OneToMany(
    () => ContractAttachment,
    (contractAttachment) => contractAttachment.contract,
    { eager: true },
  )
  //   public attachments: Set<ContractAttachment>;
  public attachments: ContractAttachment[];

  @Column({ nullable: true, type: 'varchar' })
  private partnerName: string | null;

  @Column({ nullable: true, type: 'varchar' })
  private subject: string | null;

  @Column({ nullable: false, type: 'bigint', default: Date.now() })
  private creationDate: number;

  @Column({ nullable: true, type: 'bigint' })
  private acceptedAt: number | null;

  @Column({ nullable: true, type: 'bigint' })
  private rejectedAt: number | null;

  @Column({ nullable: true, type: 'bigint' })
  private changeDate: number | null;

  @Column({
    nullable: false,
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.NEGOTIATIONS_IN_PROGRESS,
  })
  private status: ContractStatus;

  @Column({ nullable: false, type: 'varchar' })
  private contractNo: string;

  public getAttachments(): ContractAttachment[] {
    return this.attachments;
  }

  public setAttachments(attachments: ContractAttachment[]): void {
    this.attachments = attachments;
  }

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
}
