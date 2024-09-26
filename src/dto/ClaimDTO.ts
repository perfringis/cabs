import { Claim, ClaimStatus, CompletionMode } from 'src/entity/Claim';

export class ClaimDTO {
  public creationDate: Date;
  public completionDate: Date | null;
  public changeDate: Date | null;
  public reason: string;
  public incidentDescription: string | null;
  public completionMode: CompletionMode | null;
  public status: ClaimStatus;
  public claimNo: string;
  public clientId: string;
  public transitId: string;
  public isDraft: boolean;
  public claimId: string;

  constructor(claim: Claim) {
    if (claim.getStatus() === ClaimStatus.DRAFT) {
      this.setDraft(true);
    } else {
      this.setDraft(false);
    }

    this.setClaimId(claim.getId());
    this.setCreationDate(claim.getCreationDate());
    this.setCompletionDate(claim.getCompletionDate());
    this.setChangeDate(claim.getChangeDate());
    this.setReason(claim.getReason());
    this.setIncidentDescription(claim.getIncidentDescription());
    this.setCompletionMode(claim.getCompletionMode());
    this.setStatus(claim.getStatus());
    this.setClaimNo(claim.getClaimNo());
    this.setClientId(claim.getOwner().getId());
    this.setTransitId(claim.getTransit().getId());
  }

  public getCreationDate(): Date {
    return this.creationDate;
  }

  public setCreationDate(creationDate: Date): void {
    this.creationDate = creationDate;
  }

  public getCompletionDate(): Date | null {
    return this.completionDate;
  }

  public setCompletionDate(completionDate: Date | null): void {
    this.completionDate = completionDate;
  }

  public getChangeDate(): Date | null {
    return this.changeDate;
  }

  public setChangeDate(changeDate: Date | null): void {
    this.changeDate = changeDate;
  }

  public getReason(): string {
    return this.reason;
  }

  public setReason(reason: string): void {
    this.reason = reason;
  }

  public getIncidentDescription(): string | null {
    return this.incidentDescription;
  }

  public setIncidentDescription(incidentDescription: string | null): void {
    this.incidentDescription = incidentDescription;
  }

  public getCompletionMode(): CompletionMode | null {
    return this.completionMode;
  }

  public setCompletionMode(completionMode: CompletionMode | null): void {
    this.completionMode = completionMode;
  }

  public getStatus(): ClaimStatus {
    return this.status;
  }

  public setStatus(status: ClaimStatus): void {
    this.status = status;
  }

  public getClaimNo(): string {
    return this.claimNo;
  }

  public setClaimNo(claimNo: string): void {
    this.claimNo = claimNo;
  }

  public getClientId(): string {
    return this.clientId;
  }

  public setClientId(owner: string): void {
    this.clientId = owner;
  }

  public getTransitId(): string {
    return this.transitId;
  }

  public setTransitId(transit: string): void {
    this.transitId = transit;
  }

  public getIsDraft(): boolean {
    return this.isDraft;
  }

  public setDraft(draft: boolean): void {
    this.isDraft = draft;
  }

  public getClaimId(): string {
    return this.claimId;
  }

  public setClaimId(claimId: string): void {
    this.claimId = claimId;
  }
}
