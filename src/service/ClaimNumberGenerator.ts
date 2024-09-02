import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { Claim } from 'src/entity/Claim';
import { ClaimRepository } from 'src/repository/ClaimRepository';

@Injectable()
export class ClaimNumberGenerator {
  constructor(private claimRepository: ClaimRepository) {}

  public async generate(claim: Claim): Promise<string> {
    const count: number = await this.claimRepository.count();
    let prefix: number = count;

    if (count === 0) {
      prefix = 1;
    }

    const DATE_TIME_FORMATTER = 'DD/MM/YYYY';
    return (
      count + '---' + dayjs(claim.getCreationDate()).format(DATE_TIME_FORMATTER)
    );
  }
}
