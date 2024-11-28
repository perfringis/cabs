import { CarTypeService } from '../../src/service/CarTypeService';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { CarClass, CarType } from '../../src/entity/CarType';
import { CarTypeDTO } from '../../src/dto/CarTypeDTO';

describe('CarTypeUpdateIntegrationTest', () => {
  let carTypeService: CarTypeService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = await module.createNestApplication().init();

    carTypeService = app.get<CarTypeService>(CarTypeService);
  });

  test('can create car type', async () => {
    // given
    await thereIsNoCarClassInTheSystem(CarClass.VAN);

    // when
    const created: CarTypeDTO = await createCarClass(
      'duże i dobre',
      CarClass.VAN,
    );

    // then
    const loaded: CarTypeDTO = await load(created.getId());
    expect(loaded.getCarClass()).toEqual(CarClass.VAN);
    expect(loaded.getCarsCounter()).toEqual(0);
    expect(loaded.getActiveCarsCounter()).toEqual(0);
    expect(loaded.getDescription()).toEqual('duże i dobre');
  });

  test('can change car description', async () => {
    // given
    await thereIsNoCarClassInTheSystem(CarClass.VAN);

    // when
    const changed: CarTypeDTO = await createCarClass(
      'duże i bardzo dobre',
      CarClass.VAN,
    );

    // then
    const loaded: CarTypeDTO = await load(changed.getId());
    expect(loaded.getCarClass()).toEqual(CarClass.VAN);
    expect(loaded.getCarsCounter()).toEqual(0);
    expect(loaded.getDescription()).toEqual('duże i bardzo dobre');
  });

  test('can register active cars', async () => {
    // given
    const created: CarTypeDTO = await createCarClass(
      'duże i dobre',
      CarClass.VAN,
    );
    // and
    const createdCarTypeDTO: CarTypeDTO = await load(created.getId());
    const currentActiveCarsCount: number =
      createdCarTypeDTO.getActiveCarsCounter();

    // when
    await registerActiveCar(CarClass.VAN);

    // then
    const loaded: CarTypeDTO = await load(created.getId());
    expect(loaded.getActiveCarsCounter()).toEqual(currentActiveCarsCount + 1);
  });

  test('can unregister active cars', async () => {
    // given
    const created: CarTypeDTO = await createCarClass(
      'duże i dobre',
      CarClass.VAN,
    );
    // and
    await registerActiveCar(CarClass.VAN);
    // and
    const createdCarTypeDTO: CarTypeDTO = await load(created.getId());
    const currentActiveCarsCount: number =
      createdCarTypeDTO.getActiveCarsCounter();

    //  when
    await unregisterActiveCar(CarClass.VAN);

    // then
    const loaded: CarTypeDTO = await load(created.getId());
    expect(loaded.getActiveCarsCounter()).toEqual(currentActiveCarsCount - 1);
  });

  const thereIsNoCarClassInTheSystem = async (
    carClass: CarClass,
  ): Promise<void> => {
    await carTypeService.removeCarType(carClass);
  };

  const createCarClass = async (
    desc: string,
    carClass: CarClass,
  ): Promise<CarTypeDTO> => {
    const carTypeDTO: CarTypeDTO = new CarTypeDTO();
    carTypeDTO.setCarClass(carClass);
    carTypeDTO.setDescription(desc);

    const carType: CarType = await carTypeService.create(carTypeDTO);
    return await carTypeService.loadDto(carType.getId());
  };

  const load = async (id: string): Promise<CarTypeDTO> => {
    return await carTypeService.loadDto(id);
  };

  const registerActiveCar = async (carClass: CarClass): Promise<void> => {
    await carTypeService.registerActiveCar(carClass);
  };

  const unregisterActiveCar = async (carClass: CarClass): Promise<void> => {
    await carTypeService.unregisterActiveCar(carClass);
  };
});
