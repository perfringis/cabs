import { Injectable } from '@nestjs/common';
import { Address } from 'src/entity/Address';

@Injectable()
export class GeocodingService {
  public geocodeAddress(address: Address): number[] {
    //TODO ... call do zewnętrznego serwisu

    const geocoded: number[] = Array<number>(2);

    geocoded[0] = 1; //latitude
    geocoded[1] = 1; //longitude

    return geocoded;
  }
}
