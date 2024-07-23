import { Account } from './account';

export interface AccountDisplay extends Account {
  display: boolean;
  name: string;
}
