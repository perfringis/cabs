import { Claim, ClaimStatus, CompletionMode } from 'src/entity/Claim';

export class ClaimDTO {
  private creationDate: number;
  private completionDate: number | null;
  private changeDate: number | null;
  private reason: string;
  private incidentDescription: string | null;
  private completionMode: CompletionMode | null;
  private status: ClaimStatus;
  private claimNo: string;
  private clientId: string;
  private transitId: string;
  private isDraft: boolean;
  private claimId: string;

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

  public getCreationDate(): number {
    return this.creationDate;
  }

  public setCreationDate(creationDate: number): void {
    this.creationDate = creationDate;
  }

  public getCompletionDate(): number | null {
    return this.completionDate;
  }

  public setCompletionDate(completionDate: number | null): void {
    this.completionDate = completionDate;
  }

  public getChangeDate(): number | null {
    return this.changeDate;
  }

  public setChangeDate(changeDate: number | null): void {
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
