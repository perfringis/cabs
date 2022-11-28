import {
  ContractAttachment,
  ContractAttachmentStatus,
} from 'src/entity/ContractAttachment';

export class ContractAttachmentDTO {
  private id: string;
  private data: Buffer | null;
  private creationDate: number;
  private acceptedAt: number | null;
  private rejectedAt: number | null;
  private changeDate: number | null;
  private status: ContractAttachmentStatus | null;
  private contractId: string;

  constructor(attachment: ContractAttachment) {
    this.id = attachment.getId();
    this.data = attachment.getData();
    this.creationDate = attachment.getCreationDate();
    this.acceptedAt = attachment.getAcceptedAt();
    this.rejectedAt = attachment.getRejectedAt();
    this.changeDate = attachment.getChangeDate();
    this.status = attachment.getStatus();
    this.contractId = attachment.getContract().getId();
  }

  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

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

  public getContractId(): string {
    return this.contractId;
  }

  public setContractId(contractId: string): void {
    this.contractId = contractId;
  }
}
