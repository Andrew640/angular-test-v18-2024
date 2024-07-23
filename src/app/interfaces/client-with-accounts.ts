import { AccountDisplay } from './account-display';

export interface ClientWithAccounts {
  id: string;
  name: string;
  firstname: string;
  address: string;
  created: string;
  birthday: string;
  display: boolean;
  accounts: AccountDisplay[];
}
