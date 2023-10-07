import { Injectable } from '@nestjs/common';
import { Contract } from 'src/entity/Contract';
import { ContractAttachment } from 'src/entity/ContractAttachment';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ContractAttachmentRepository extends Repository<ContractAttachment> {
  constructor(private dataSource: DataSource) {
    super(ContractAttachment, dataSource.createEntityManager());
  }

  // TODO maybe in future wil be changed
  // return this.find({ where: { contract } });

  public async findByContract(
    contract: Contract,
  ): Promise<ContractAttachment[]> {
    return await this.find({
      where: {
        contract: {
          id: contract.getId(),
        },
      },
    });
  }
}
