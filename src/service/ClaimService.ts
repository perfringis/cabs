import { Injectable, NotFoundException } from '@nestjs/common';
import { ClaimRepository } from 'src/repository/ClaimRepository';
import { ClientRepository } from 'src/repository/ClientRepository';
import { TransitRepository } from 'src/repository/TransitRepository';
import { ClaimNumberGenerator } from './ClaimNumberGenerator';
import { AppProperties } from 'src/config/AppProperties';
import { AwardsService } from './AwardsService';
import { ClientNotificationService } from './ClientNotificationService';
import { DriverNotificationService } from './DriverNotificationService';
import { Claim, ClaimStatus, CompletionMode } from 'src/entity/Claim';
import { ClaimDTO } from 'src/dto/ClaimDTO';
import dayjs from 'dayjs';
import { Client, Type } from 'src/entity/Client';
import { Transit } from 'src/entity/Transit';

@Injectable()
export class ClaimService {
  constructor(
    private clientRepository: ClientRepository,
    private transitRepository: TransitRepository,
    private claimRepository: ClaimRepository,
    private claimNumberGenerator: ClaimNumberGenerator,
    private appProperties: AppProperties,
    private awardsService: AwardsService,
    private clientNotificationService: ClientNotificationService,
    private driverNotificationService: DriverNotificationService,
  ) {}

  public async create(claimDTO: ClaimDTO): Promise<Claim> {
    let claim: Claim = new Claim();
    claim.setCreationDate(dayjs().toDate());
    claim.setClaimNo(await this.claimNumberGenerator.generate(claim));

    claim = await this.update(claimDTO, claim);

    return claim;
  }

  public async find(id: string): Promise<Claim> {
    const claim: Claim = await this.claimRepository.getOne(id);
    if (claim === null) {
      throw new NotFoundException('Claim does not exists');
    }

    return claim;
  }

  public async update(claimDTO: ClaimDTO, claim: Claim): Promise<Claim> {
    const client: Client = await this.clientRepository.getOne(
      claimDTO.clientId,
    );
    const transit: Transit = await this.transitRepository.getOne(
      claimDTO.transitId,
    );

    if (client === null) {
      throw new NotFoundException('Client does not exists');
    }

    if (transit === null) {
      throw new NotFoundException('Transit does not exists');
    }

    if (claimDTO.isDraft) {
      claim.setStatus(ClaimStatus.DRAFT);
    } else {
      claim.setStatus(ClaimStatus.NEW);
    }

    claim.setOwner(client);
    claim.setTransit(transit);
    claim.setCreationDate(dayjs().toDate());
    claim.setReason(claimDTO.reason);
    claim.setIncidentDescription(claimDTO.incidentDescription);

    return await this.claimRepository.save(claim);
  }

  public async setStatus(newStatus: ClaimStatus, id: string): Promise<Claim> {
    const claim: Claim = await this.find(id);
    claim.setStatus(newStatus);

    await this.claimRepository.save(claim);

    return claim;
  }

  public async tryToResolveAutomatically(id: string): Promise<Claim> {
    const claim: Claim = await this.find(id);

    if (
      (
        await this.claimRepository.findByOwnerAndTransit(
          claim.getOwner(),
          claim.getTransit(),
        )
      ).length > 1
    ) {
      claim.setStatus(ClaimStatus.ESCALATED);
      claim.setCompletionDate(dayjs().toDate());
      claim.setChangeDate(dayjs().toDate());
      claim.setCompletionMode(CompletionMode.MANUAL);

      await this.claimRepository.save(claim);

      return claim;
    }

    if (
      (await this.claimRepository.findByOwner(claim.getOwner())).length <= 3
    ) {
      claim.setStatus(ClaimStatus.REFUNDED);
      claim.setCompletionDate(dayjs().toDate());
      claim.setChangeDate(dayjs().toDate());
      claim.setCompletionMode(CompletionMode.AUTOMATIC);

      this.clientNotificationService.notifyClientAboutRefund(
        claim.getClaimNo(),
        claim.getOwner().getId(),
      );

      await this.claimRepository.save(claim);

      return claim;
    }

    if (claim.getOwner().getType() === Type.VIP) {
      if (
        claim.getTransit().getPrice() <
        this.appProperties.getAutomaticRefundForVipThreshold()
      ) {
        claim.setStatus(ClaimStatus.REFUNDED);
        claim.setCompletionDate(dayjs().toDate());
        claim.setChangeDate(dayjs().toDate());
        claim.setCompletionMode(CompletionMode.AUTOMATIC);
        this.clientNotificationService.notifyClientAboutRefund(
          claim.getClaimNo(),
          claim.getOwner().getId(),
        );
        await this.awardsService.registerSpecialMiles(
          claim.getOwner().getId(),
          10,
        );
      } else {
        claim.setStatus(ClaimStatus.ESCALATED);
        claim.setCompletionDate(dayjs().toDate());
        claim.setChangeDate(dayjs().toDate());
        claim.setCompletionMode(CompletionMode.MANUAL);
        this.driverNotificationService.askDriverForDetailsAboutClaim(
          claim.getClaimNo(),
          claim.getTransit().getDriver().getId(),
        );
      }
    } else {
      if (
        (await this.transitRepository.findByClient(claim.getOwner())).length >=
        this.appProperties.getNoOfTransitsForClaimAutomaticRefund()
      ) {
        if (
          claim.getTransit().getPrice() <
          this.appProperties.getAutomaticRefundForVipThreshold()
        ) {
          claim.setStatus(ClaimStatus.REFUNDED);
          claim.setCompletionDate(dayjs().toDate());
          claim.setChangeDate(dayjs().toDate());
          claim.setCompletionMode(CompletionMode.AUTOMATIC);
          this.clientNotificationService.notifyClientAboutRefund(
            claim.getClaimNo(),
            claim.getOwner().getId(),
          );
        } else {
          claim.setStatus(ClaimStatus.ESCALATED);
          claim.setCompletionDate(dayjs().toDate());
          claim.setChangeDate(dayjs().toDate());
          claim.setCompletionMode(CompletionMode.MANUAL);
          this.clientNotificationService.askForMoreInformation(
            claim.getClaimNo(),
            claim.getOwner().getId(),
          );
        }
      } else {
        claim.setStatus(ClaimStatus.ESCALATED);
        claim.setCompletionDate(dayjs().toDate());
        claim.setChangeDate(dayjs().toDate());
        claim.setCompletionMode(CompletionMode.MANUAL);
        this.driverNotificationService.askDriverForDetailsAboutClaim(
          claim.getClaimNo(),
          claim.getOwner().getId(),
        );
      }
    }

    await this.claimRepository.save(claim);

    return claim;
  }
}
