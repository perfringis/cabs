import { Injectable } from '@nestjs/common';
import { Contract } from 'src/entity/Contract';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ContractRepository extends Repository<Contract> {
  constructor(private dataSource: DataSource) {
    super(Contract, dataSource.createEntityManager());
  }

  public async findByPartnerName(partnerName: string): Promise<Contract[]> {
    return await this.find({
      where: {
        partnerName,
      },
    });
  }

  public async getOne(contractId: string): Promise<Contract> {
    return await this.findOne({
      where: {
        id: contractId,
      },
    });
  }
}
