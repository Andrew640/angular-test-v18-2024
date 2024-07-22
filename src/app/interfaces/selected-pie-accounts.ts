import { Account } from './account';

export interface SelectedPieAccounts {
  clientId: string;
  type: string;
  accounts: Account[];
}
