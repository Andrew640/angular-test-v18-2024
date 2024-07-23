import { AccountDisplay } from './account-display';

export interface SelectedPieAccounts {
  clientId: string;
  type: string;
  accounts: AccountDisplay[];
}
