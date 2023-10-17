import { AwardsAccountDTO } from 'src/dto/AwardsAccountDTO';
import { AwardedMiles } from 'src/entity/AwardedMiles';

export interface AwardsServiceInterface {
  findBy: (clientId: string) => Promise<AwardsAccountDTO>;

  registerToProgram: (clientId: string) => Promise<void>;

  activateAccount: (clientId: string) => Promise<void>;

  deactivateAccount: (clientId: string) => Promise<void>;

  registerMiles(clientId: string, transitId: string): Promise<AwardedMiles>;

  // registerSpecialMiles(clientId: string, miles: number): AwardedMiles;

  // removeMiles(clientId: string, miles: number): void;

  // calculateBalance(clientId: string): number;

  // transferMiles(fromClientId: string, toClientId: string, miles: number): void;
}
