import { Injectable } from '@nestjs/common';
import { Address } from 'src/entity/Address';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AddressRepository extends Repository<Address> {
  constructor(private dataSource: DataSource) {
    super(Address, dataSource.createEntityManager());
  }

  // FIX ME: To replace with getOrCreate method instead of that?
  // Actual workaround for address uniqueness problem: assign result from repo.save to variable for later usage
  //@ts-expect-error to avoid params error
  public async save(address: Address): Promise<Address> {
    address.setHash();

    if (!address.getId()) {
      const existingAddress: Address = await this.findByHash(address.getHash());

      if (existingAddress) {
        return existingAddress;
      }
    }

    return super.save(address);
  }

  public async findByHash(hash: string): Promise<Address> {
    return this.findOne({
      where: {
        hash: hash,
      },
    });
  }

  public async getOne(id: string): Promise<Address> {
    return this.findOne({
      where: {
        id: id,
      },
    });
  }
}
