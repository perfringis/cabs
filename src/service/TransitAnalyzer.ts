import { NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import { Address } from 'src/entity/Address';
import { Client } from 'src/entity/Client';
import { Status, Transit } from 'src/entity/Transit';
import { AddressRepository } from 'src/repository/AddressRepository';
import { ClientRepository } from 'src/repository/ClientRepository';
import { TransitRepository } from 'src/repository/TransitRepository';

export class TransitAnalyzer {
  constructor(
    private transitRepository: TransitRepository,
    private clientRepository: ClientRepository,
    private addressRepository: AddressRepository,
  ) {}

  public async analyze(
    clientId: string,
    addressId: string,
  ): Promise<Address[]> {
    const client: Client = await this.clientRepository.getOne(clientId);

    if (client === null) {
      throw new NotFoundException('Client does not exists, id = ' + clientId);
    }

    const address: Address = await this.addressRepository.getOne(addressId);

    if (address === null) {
      throw new NotFoundException('Address does not exists, id = ' + addressId);
    }

    return await this._analyze(client, address, null);
  }

  private async _analyze(
    client: Client,
    from: Address,
    t: Transit,
  ): Promise<Address[]> {
    let ts: Transit[] = [];

    if (t === null) {
      ts =
        await this.transitRepository.findAllByClientAndFromAndStatusOrderByDateTimeDesc(
          client,
          from,
          Status.COMPLETED,
        );
    } else {
      ts =
        await this.transitRepository.findAllByClientAndFromAndPublishedAfterAndStatusOrderByDateTimeDesc(
          client,
          from,
          t.getPublished(),
          Status.COMPLETED,
        );
    }

    // Workaround for performance reasons.
    if (ts.length > 1000 && client.getId() === '666') {
      // No one will see a difference for this customer ;)
      ts = ts.slice(0, 1000);
    }

    // if (ts.length === 0) {
    //   return [t.getTo()];
    // }

    if (t !== null) {
      ts = ts.filter((_t) =>
        dayjs(t.getCompleteAt()).add(15, 'minute').isAfter(_t.getStarted()),
      );
      // Before 2018-01-01:
      // .filter((t) =>
      //   dayjs(t.getCompleteAt()).add(15, 'minute').isAfter(t.getPublished()),
      // );
    }

    if (ts.length === 0) {
      return [t.getTo()];
    }

    const comparator = (a: Address[], b: Address[]) => b.length - a.length;

    const results: Address[][] = await Promise.all(
      ts.map(async (_t: Transit) => {
        const result: Address[] = [];

        result.push(_t.getFrom());
        result.push(...(await this._analyze(client, _t.getFrom(), _t)));

        return result;
      }),
    );

    results.sort(comparator);

    return results.length ? results[0] : [];
  }
}
