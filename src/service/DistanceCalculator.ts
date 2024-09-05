import { Injectable } from '@nestjs/common';

@Injectable()
export class DistanceCalculator {
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  public calculateByMap(
    latitudeFrom: number,
    longitudeFrom: number,
    latitudeTo: number,
    longitudeTo: number,
  ): number {
    // ...

    return 42;
  }

  public calculateByGeo(
    latitudeFrom: number,
    longitudeFrom: number,
    latitudeTo: number,
    longitudeTo: number,
  ): number {
    // https://www.geeksforgeeks.org/program-distance-two-points-earth/
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.

    const lon1: number = this.toRadians(longitudeFrom);
    const lon2: number = this.toRadians(longitudeTo);
    const lat1: number = this.toRadians(latitudeFrom);
    const lat2: number = this.toRadians(latitudeTo);

    // Haversine formula
    const dlon: number = lon2 - lon1;
    const dlat: number = lat2 - lat1;

    const a: number =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

    const c: number = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956 for miles
    const r = 6371;

    // calculate the result
    const distanceInKMeters: number = c * r;

    return distanceInKMeters;
  }
}
