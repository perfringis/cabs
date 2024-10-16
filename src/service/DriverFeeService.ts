import { Injectable, NotFoundException } from '@nestjs/common';
import { DriverFee, FeeType } from 'src/entity/DriverFee';
import { Transit } from 'src/entity/Transit';
import { DriverFeeRepository } from 'src/repository/DriverFeeRepository';
import { TransitRepository } from 'src/repository/TransitRepository';

@Injectable()
export class DriverFeeService {
  constructor(
    private driverFeeRepository: DriverFeeRepository,
    private transitRepository: TransitRepository,
  ) {}

  public async calculateDriverFee(transitId: string): Promise<number> {
    const transit: Transit = await this.transitRepository.getOne(transitId);

    if (transit === null) {
      throw new NotFoundException('transit does not exist, id = ' + transitId);
    }

    if (transit.getDriversFee() !== null) {
      return transit.getDriversFee();
    }

    const transitPrice: number = transit.getPrice().toInt();
    const driverFee: DriverFee = await this.driverFeeRepository.findByDriver(
      transit.getDriver(),
    );

    if (driverFee === null) {
      throw new NotFoundException(
        'driver Fees not defined for driver, driver id = ' +
          transit.getDriver().getId(),
      );
    }

    let finalFee: number;

    if (driverFee.getFeeType() === FeeType.FLAT) {
      finalFee = transitPrice - driverFee.getAmount();
    } else {
      finalFee = (transitPrice * driverFee.getAmount()) / 100;
    }

    return Math.max(
      finalFee,
      driverFee.getMin() === null ? 0 : driverFee.getMin(),
    );
  }
}
