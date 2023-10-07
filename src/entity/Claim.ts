import { BaseEntity } from 'src/common/BaseEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  VersionColumn,
} from 'typeorm';
import { Client } from './Client';
import { Transit } from './Transit';

export enum CompletionMode {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
}

export enum ClaimStatus {
  DRAFT = 'draft',
  NEW = 'new',
  IN_PROCESS = 'in_process',
  REFUNDED = 'refunded',
  ESCALATED = 'escalated',
  REJECTED = 'rejected',
}

@Entity({ name: 'claim' })
export class Claim extends BaseEntity {
  @Column({ name: 'creation_date', nullable: false, type: 'datetime' })
  private creationDate: Date;

  @Column({ name: 'completion_date', nullable: true, type: 'datetime' })
  private completionDate: Date | null;

  @Column({ name: 'change_date', nullable: true, type: 'datetime' })
  private changeDate: Date | null;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  private reason: string;

  @Column({
    name: 'incident_description',
    nullable: true,
    type: 'varchar',
    length: 255,
  })
  private incidentDescription: string | null;

  @Column({
    name: 'completion_mode',
    nullable: true,
    type: 'enum',
    enum: CompletionMode,
  })
  private completionMode: CompletionMode | null;

  @Column({ nullable: false, type: 'enum', enum: ClaimStatus })
  private status: ClaimStatus;

  @Column({ name: 'claim_no', nullable: false, type: 'varchar', length: 255 })
  private claimNo: string;

  @ManyToOne(() => Client, (client) => client.claims)
  @JoinColumn({ name: 'owner_id' })
  public owner: Client;

  @OneToOne(() => Transit)
  @JoinColumn({ name: 'transit_id' })
  public transit: Transit;

  @VersionColumn({ type: 'int', nullable: true })
  private version: number | null;

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

  public getOwner(): Client {
    return this.owner;
  }

  public setOwner(owner: Client): void {
    this.owner = owner;
  }

  public getTransit(): Transit {
    return this.transit;
  }

  public setTransit(transit: Transit): void {
    this.transit = transit;
  }
}
