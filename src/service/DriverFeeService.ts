import { Injectable, NotFoundException } from '@nestjs/common';
import { DriverFee, FeeType } from 'src/entity/DriverFee';
import { Money } from 'src/entity/Money';
import { Transit } from 'src/entity/Transit';
import { DriverFeeRepository } from 'src/repository/DriverFeeRepository';
import { TransitRepository } from 'src/repository/TransitRepository';

@Injectable()
export class DriverFeeService {
  constructor(
    private driverFeeRepository: DriverFeeRepository,
    private transitRepository: TransitRepository,
  ) {}

  public async calculateDriverFee(transitId: string): Promise<Money> {
    const transit: Transit = await this.transitRepository.getOne(transitId);

    if (transit === null) {
      throw new NotFoundException('transit does not exist, id = ' + transitId);
    }

    // getDriversFee returns 0.00 WHY??!!
    if (transit.getDriversFee().toInt() !== null) {
      return transit.getDriversFee();
    }

    const transitPrice: Money = transit.getPrice();
    const driverFee: DriverFee = await this.driverFeeRepository.findByDriver(
      transit.getDriver(),
    );

    if (driverFee === null) {
      throw new NotFoundException(
        'driver Fees not defined for driver, driver id = ' +
          transit.getDriver().getId(),
      );
    }

    let finalFee: Money;
    if (driverFee.getFeeType() === FeeType.FLAT) {
      finalFee = transitPrice.subtract(new Money(driverFee.getAmount()));
    } else {
      finalFee = transitPrice.percentage(driverFee.getAmount());
    }

    return new Money(
      Math.max(
        finalFee.toInt(),
        driverFee.getMin() === null ? 0 : driverFee.getMin().toInt(),
      ),
    );
  }
}
