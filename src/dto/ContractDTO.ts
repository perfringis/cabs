import { Contract, ContractStatus } from 'src/entity/Contract';
import { ContractAttachmentDTO } from './ContractAttachmentDTO';

export class ContractDTO {
  private id: string;
  private partnerName: string | null;
  private subject: string | null;
  private creationDate: number;
  private acceptedAt: number | null;
  private rejectedAt: number | null;
  private changeDate: number | null;
  private status: ContractStatus;
  private contractNo: string;
  public attachments: ContractAttachmentDTO[];

  constructor(contract: Contract) {
    this.id = contract.getId();
    this.partnerName = contract.getPartnerName();
    this.subject = contract.getSubject();
    this.creationDate = contract.getCreationDate();
    this.acceptedAt = contract.getAcceptedAt();
    this.rejectedAt = contract.getRejectedAt();
    this.changeDate = contract.getChangeDate();
    this.status = contract.getStatus();
    this.contractNo = contract.getContractNo();

    for (const attachment of contract.getAttachments()) {
      this.attachments.push(new ContractAttachmentDTO(attachment));
    }
  }

  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
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

  public getAttachments(): ContractAttachmentDTO[] {
    return this.attachments;
  }

  public setAttachments(attachments: ContractAttachmentDTO[]): void {
    this.attachments = attachments;
  }
}
