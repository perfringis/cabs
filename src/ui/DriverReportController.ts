import { Controller, Get, Param, Query } from '@nestjs/common';
import dayjs from 'dayjs';
import { ClaimDTO } from 'src/dto/ClaimDTO';
import { DriverAttributeDTO } from 'src/dto/DriverAttributeDTO';
import { DriverDTO } from 'src/dto/DriverDTO';
import { DriverReport } from 'src/dto/DriverReport';
import { DriverSessionDTO } from 'src/dto/DriverSessionDTO';
import { TransitDTO } from 'src/dto/TransitDTO';
import { Claim } from 'src/entity/Claim';
import { Driver } from 'src/entity/Driver';
import { DriverAttributeName } from 'src/entity/DriverAttribute';
import { DriverSession } from 'src/entity/DriverSession';
import { Status, Transit } from 'src/entity/Transit';
import { ClaimRepository } from 'src/repository/ClaimRepository';
import { DriverRepository } from 'src/repository/DriverRepository';
import { DriverSessionRepository } from 'src/repository/DriverSessionRepository';
import { DriverService } from 'src/service/DriverService';

@Controller()
export class DriverReportController {
  constructor(
    private driverService: DriverService,
    private driverRepository: DriverRepository,
    private claimRepository: ClaimRepository,
    private driverSessionRepository: DriverSessionRepository,
  ) {}

  @Get('/driverreport/:driverId')
  public async loadReportForDriver(
    @Param('driverId') driverId: string,
    @Query('lastDays') lastDays: number,
  ) {
    const driverReport: DriverReport = new DriverReport();
    const driverDTO: DriverDTO = await this.driverService.loadDriver(driverId);
    driverReport.setDriverDTO(driverDTO);
    const driver: Driver = await this.driverRepository.getOne(driverId);
    driver
      .getAttributes()
      .filter(
        (attr) =>
          !(attr.getName() === DriverAttributeName.MEDICAL_EXAMINATION_REMARKS),
      )
      .forEach((attr) => {
        driverReport.getAttributes().push(new DriverAttributeDTO(attr));
      });

    const beggingOfToday = dayjs().startOf('day');
    const since = beggingOfToday.subtract(lastDays, 'day');
    const allByDriverAndLoggedAtAfter: DriverSession[] =
      await this.driverSessionRepository.findAllByDriverAndLoggedAtAfter(
        driver,
        since.toDate(),
      );
    const sessionsWithTransits: Map<DriverSessionDTO, TransitDTO[]> = new Map<
      DriverSessionDTO,
      TransitDTO[]
    >();

    for (const session of allByDriverAndLoggedAtAfter) {
      const dto: DriverSessionDTO = new DriverSessionDTO(session);
      const transitsInSession: Transit[] = driver.getTransits().filter((t) => {
        return (
          t.getStatus() === Status.COMPLETED &&
          !dayjs(t.getCompleteAt()).isBefore(session.getLoggedAt()) &&
          !dayjs(t.getCompleteAt()).isAfter(session.getLoggedOutAt())
        );
      });

      const transitsDtosInSession: TransitDTO[] = [];
      for (const t of transitsInSession) {
        const transitDTO: TransitDTO = new TransitDTO(t);
        const byOwnerAndTransit: Claim[] =
          await this.claimRepository.findByOwnerAndTransit(t.getClient(), t);
        if (!(byOwnerAndTransit.length === 0)) {
          const claim: ClaimDTO = new ClaimDTO(byOwnerAndTransit[0]);
          transitDTO.setClaimDTO(claim);
        }
        transitsDtosInSession.push(transitDTO);
      }
      sessionsWithTransits.set(dto, transitsDtosInSession);
    }
    driverReport.setSessions(sessionsWithTransits);
    return driverReport;
  }
}
