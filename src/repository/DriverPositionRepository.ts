import { Injectable } from '@nestjs/common';
import { DriverPositionDTOV2 } from 'src/dto/DriverPositionDTOV2';
import { Driver } from 'src/entity/Driver';
import { DriverPosition } from 'src/entity/DriverPosition';
import { Between, DataSource, Repository } from 'typeorm';

@Injectable()
export class DriverPositionRepository extends Repository<DriverPosition> {
  constructor(private dataSource: DataSource) {
    super(DriverPosition, dataSource.createEntityManager());
  }

  /*
    SELECT 
        p.driver, 
        avg(p.latitude), 
        avg(p.longitude), 
        max(p.seenAt)
    FROM DriverPosition p 
    WHERE p.latitude between ?1 and ?2 
        and p.longitude between ?3 and ?4 
        and p.seenAt >= ?5 
    GROUP BY p.driver.id"
    )
  */

  public async findAverageDriverPositionSince(
    latitudeMin: number,
    latitudeMax: number,
    longitudeMin: number,
    longitudeMax: number,
    date: Date,
  ): Promise<DriverPositionDTOV2[]> {
    const results = await this.createQueryBuilder('p')
      .innerJoinAndSelect('p.driver', 'driver')
      .select('AVG(p.latitude)', 'latitude')
      .addSelect('AVG(p.longitude)', 'longitude')
      .addSelect('MAX(p.seenAt)', 'seen_at')
      .addSelect('driver')
      .where('p.latitude between :latitudeMin and :latitudeMax', {
        latitudeMin: latitudeMin,
        latitudeMax: latitudeMax,
      })
      .andWhere('p.longitude between :longitudeMin and :longitudeMax', {
        longitudeMin: longitudeMin,
        longitudeMax: longitudeMax,
      })
      .andWhere('p.seenAt >= :seenAt', {
        seenAt: date,
      })
      .groupBy('p.driver_id')
      .getRawMany();

    return results.map((result) => {
      const driver: Driver = new Driver();

      driver.id = result.driver_id;
      driver.setType(result.driver_type);
      driver.setStatus(result.driver_status);
      driver.setFirstName(result.driver_first_name);
      driver.setLastName(result.driver_last_name);
      driver.setPhoto(result.driver_photo);
      driver.setDriverLicense(result.driver_driver_license);
      driver.setIsOccupied(result.driver_is_occupied);

      return new DriverPositionDTOV2(
        driver,
        result.latitude,
        result.longitude,
        result.seen_at,
      );
    });
  }

  public async findByDriverAndSeenAtBetweenOrderBySeenAtAsc(
    driver: Driver,
    from: Date,
    to: Date,
  ): Promise<DriverPosition[]> {
    return await this.find({
      where: {
        driver: driver,
        seenAt: Between(from, to),
      },
      order: {
        seenAt: 'ASC',
      },
    });
  }
}
