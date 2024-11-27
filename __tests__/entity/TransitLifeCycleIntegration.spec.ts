import { NotAcceptableException } from '@nestjs/common';
import { Address } from 'src/entity/Address';
import { Client } from 'src/entity/Client';
import { Driver } from 'src/entity/Driver';
import { Status, Transit } from 'src/entity/Transit';
import dayjs from 'dayjs';
import { Distance } from '../../src/entity/Distance';

describe('TransitLifeCycleIntegrationTest', () => {
  test('can create transit', () => {
    // when
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      new Address('Polska', 'Warszawa', 'Żytnia', 25),
    );

    // then
    expect(transit.getCarType()).toBeNull();
    expect(transit.getPrice()).toBeUndefined();

    expect(transit.getFrom().getCountry()).toEqual('Polska');
    expect(transit.getFrom().getCity()).toEqual('Warszawa');
    expect(transit.getFrom().getStreet()).toEqual('Młynarska');
    expect(transit.getFrom().getBuildingNumber()).toEqual(20);

    expect(transit.getTo().getCountry()).toEqual('Polska');
    expect(transit.getTo().getCity()).toEqual('Warszawa');
    expect(transit.getTo().getStreet()).toEqual('Żytnia');
    expect(transit.getTo().getBuildingNumber()).toEqual(25);

    expect(transit.getStatus()).toEqual(Status.DRAFT);
    expect(transit.getTariff()).not.toBeNull();
    expect(transit.getTariff().getKmRate()).not.toEqual(0);
    expect(transit.getDateTime()).not.toBeNull();
  });

  test('can change transit destination', () => {
    // given
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      new Address('Polska', 'Warszawa', 'Żytnia', 25),
    );

    // when
    transit.changeDestinationTo(
      new Address('Polska', 'Warszawa', 'Mazowiecka', 30),
      Distance.ofKm(30),
    );

    // then
    expect(transit.getTo().getBuildingNumber()).toEqual(30);
    expect(transit.getTo().getStreet()).toEqual('Mazowiecka');
    expect(transit.getEstimatedPrice()).not.toBeNull();
    expect(transit.getPrice()).toBeUndefined();
  });

  test('cannot change destination when transit is completed', () => {
    // given
    const destination: Address = new Address(
      'Polska',
      'Warszawa',
      'Żytnia',
      25,
    );
    // and
    const driver: Driver = new Driver();
    // and
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      destination,
    );
    // and

    transit.publishAt(now());
    // and
    transit.proposeTo(driver);
    // and
    transit.acceptBy(driver, now());
    // and
    transit.start(now());
    // and
    transit.setCompleteAt(now(), destination, Distance.ofKm(20));

    // expect
    expect(() => {
      transit.changeDestinationTo(
        new Address('Polska', 'Warszawa', 'Żytnia', 23),
        Distance.ofKm(20),
      );
    }).toThrow(NotAcceptableException);
  });

  test('can change pickup place', () => {
    // given
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      new Address('Polska', 'Warszawa', 'Żytnia', 25),
    );

    // when
    transit.changePickUpTo(
      new Address('Polska', 'Warszawa', 'Puławska', 28),
      Distance.ofKm(20),
      0.2,
    );

    // then
    expect(transit.getFrom().getBuildingNumber()).toEqual(28);
    expect(transit.getFrom().getStreet()).toEqual('Puławska');
  });

  test('cannot change pickup place after transit is accepted', () => {
    // given
    const destination: Address = new Address(
      'Polska',
      'Warszawa',
      'Żytnia',
      25,
    );
    // and
    const driver: Driver = new Driver();
    // and
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      destination,
    );
    // and
    const changeTo: Address = new Address('Polska', 'Warszawa', 'Żytnia', 27);
    // and

    transit.publishAt(now());
    // and
    transit.proposeTo(driver);
    // and
    transit.acceptBy(driver, now());

    // expect
    expect(() => {
      transit.changePickUpTo(changeTo, Distance.ofKm(20.1), 0.1);
    }).toThrow(NotAcceptableException);
    // and
    transit.start(now());
    // expect
    expect(() => {
      transit.changePickUpTo(changeTo, Distance.ofKm(20.11), 0.11);
    }).toThrow(NotAcceptableException);

    // and
    transit.setCompleteAt(now(), destination, Distance.ofKm(20));
    // expect
    expect(() => {
      transit.changePickUpTo(changeTo, Distance.ofKm(20.12), 0.12);
    }).toThrow(NotAcceptableException);
  });

  test('cannot change pickup place more than three times', () => {
    // given
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      new Address('Polska', 'Warszawa', 'Żytnia', 25),
    );
    // and
    transit.changePickUpTo(
      new Address('Polska', 'Warszawa', 'Żytnia', 26),
      Distance.ofKm(20.1),
      0.1,
    );
    // and
    transit.changePickUpTo(
      new Address('Polska', 'Warszawa', 'Żytnia', 27),
      Distance.ofKm(20.2),
      0.2,
    );
    // and
    transit.changePickUpTo(
      new Address('Polska', 'Warszawa', 'Żytnia', 28),
      Distance.ofKm(20.22),
      0.22,
    );

    expect(() => {
      transit.changePickUpTo(
        new Address('Polska', 'Warszawa', 'Żytnia', 29),
        Distance.ofKm(20.3),
        0.23,
      );
    }).toThrow(NotAcceptableException);
  });

  test('cannot change pickup place when it is far away from original', () => {
    // given
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      new Address('Polska', 'Warszawa', 'Żytnia', 25),
    );

    // expect
    expect(() => {
      transit.changePickUpTo(
        new Address(null, null, null, null),
        Distance.ofKm(20),
        50,
      );
    }).toThrow(NotAcceptableException);
  });

  test('can cancel transit', () => {
    // given
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      new Address('Polska', 'Warszawa', 'Żytnia', 25),
    );

    // when
    transit.cancel();

    // then
    expect(transit.getStatus()).toEqual(Status.CANCELLED);
  });

  test('cannot cancel transit after it was started', () => {
    // given
    const destination: Address = new Address(
      'Polska',
      'Warszawa',
      'Żytnia',
      25,
    );
    // and
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      destination,
    );
    // and
    const driver: Driver = new Driver();
    // and

    transit.publishAt(now());
    // and
    transit.proposeTo(driver);
    // and
    transit.acceptBy(driver, now());

    // and
    transit.start(now());
    // expect
    expect(() => {
      transit.cancel();
    }).toThrow(NotAcceptableException);
    // and
    transit.setCompleteAt(now(), destination, Distance.ofKm(20));
    // expect
    expect(() => {
      transit.cancel();
    }).toThrow(NotAcceptableException);
  });

  test('can publish transit', () => {
    // given
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      new Address('Polska', 'Warszawa', 'Żytnia', 25),
    );

    // when
    transit.publishAt(now());

    // then
    expect(transit.getStatus()).toEqual(Status.WAITING_FOR_DRIVER_ASSIGNMENT);
    expect(transit.getPublished()).not.toBeNull();
  });

  test('can accept transit', () => {
    // given
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      new Address('Polska', 'Warszawa', 'Żytnia', 25),
    );
    // and
    const driver: Driver = new Driver();
    // and
    transit.publishAt(now());
    // and
    transit.proposeTo(driver);

    // when
    transit.acceptBy(driver, now());

    // then
    expect(transit.getStatus()).toEqual(Status.TRANSIT_TO_PASSENGER);
    expect(transit.getAcceptedAt()).not.toBeNull();
  });

  test('only one driver can accept transit', () => {
    // given
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      new Address('Polska', 'Warszawa', 'Żytnia', 25),
    );
    // and
    const driver: Driver = new Driver();
    // and
    const secondDriver: Driver = new Driver();
    // and

    transit.publishAt(now());
    // and
    transit.proposeTo(driver);
    // and
    transit.acceptBy(driver, now());

    // expect
    expect(() => {
      transit.acceptBy(secondDriver, now());
    }).toThrow(NotAcceptableException);
  });

  test('transit cannot be accepted by driver who already rejected', () => {
    // given
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      new Address('Polska', 'Warszawa', 'Żytnia', 25),
    );
    // and
    const driver: Driver = new Driver();
    // and

    transit.publishAt(now());
    // and
    transit.rejectBy(driver);

    // expect
    expect(() => {
      transit.acceptBy(driver, now());
    }).toThrow(NotAcceptableException);
  });

  test('transit cannot be accepted by driver who has not seen proposal', () => {
    // given
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      new Address('Polska', 'Warszawa', 'Żytnia', 25),
    );
    // and
    const driver: Driver = new Driver();
    // and
    transit.publishAt(now());

    // expect
    expect(() => {
      transit.acceptBy(driver, now());
    }).toThrow(NotAcceptableException);
  });

  test('can start transit', () => {
    // given
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      new Address('Polska', 'Warszawa', 'Żytnia', 25),
    );
    // and
    const driver: Driver = new Driver();
    // and

    transit.publishAt(now());
    // and
    transit.proposeTo(driver);
    // and
    transit.acceptBy(driver, now());
    // when
    transit.start(now());

    // then
    expect(transit.getStatus()).toEqual(Status.IN_TRANSIT);
    expect(transit.getStarted()).not.toBeNull();
  });

  test('cannot start not accepted transit', () => {
    // given
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      new Address('Polska', 'Warszawa', 'Żytnia', 25),
    );
    //and
    transit.publishAt(now());

    // expect
    expect(() => {
      transit.start(now());
    }).toThrow(NotAcceptableException);
  });

  test('can complete transit', () => {
    // given
    const destination: Address = new Address(
      'Polska',
      'Warszawa',
      'Żytnia',
      25,
    );
    // and
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      destination,
    );
    // and
    const driver: Driver = new Driver();
    // and
    transit.publishAt(now());
    // and
    transit.proposeTo(driver);
    // and
    transit.acceptBy(driver, now());
    // and
    transit.start(now());

    // when
    transit.setCompleteAt(now(), destination, Distance.ofKm(20));

    // then
    expect(transit.getStatus()).toEqual(Status.COMPLETED);
    expect(transit.getTariff()).not.toBeNull();
    expect(transit.getPrice()).toBeNull();
    expect(transit.getCompleteAt()).not.toBeNull();
  });

  test('cannot complete not started transit', () => {
    // given
    const addressTo: Address = new Address('Polska', 'Warszawa', 'Żytnia', 25);
    // and
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      addressTo,
    );
    // and
    const driver: Driver = new Driver();
    // and

    transit.publishAt(now());
    // and
    transit.proposeTo(driver);
    // and
    transit.acceptBy(driver, now());

    // expect
    expect(() => {
      transit.setCompleteAt(now(), addressTo, Distance.ofKm(20));
    }).toThrow(NotAcceptableException);
  });

  test('can reject transit', () => {
    // given
    const transit: Transit = requestTransitFromTo(
      new Address('Polska', 'Warszawa', 'Młynarska', 20),
      new Address('Polska', 'Warszawa', 'Żytnia', 25),
    );
    // and
    const driver: Driver = new Driver();
    // and
    transit.publishAt(now());

    // when
    transit.rejectBy(driver);

    // then
    expect(transit.getStatus()).toEqual(Status.WAITING_FOR_DRIVER_ASSIGNMENT);
    expect(transit.getAcceptedAt()).toBeUndefined();
  });

  const requestTransitFromTo = (
    pickup: Address,
    destination: Address,
  ): Transit => {
    const transit: Transit = new Transit(
      pickup,
      destination,
      new Client(),
      null,
      now(),
      Distance.ZERO,
    );

    // INFO: It has to be initialized in that way bcs of TypeORM
    transit.driversRejections = new Array<Driver>();
    transit.proposedDrivers = new Array<Driver>();
    transit.pickupAddressChangeCounter = 0;

    return transit;
  };

  const now = (): Date => {
    return dayjs().toDate();
  };
});
