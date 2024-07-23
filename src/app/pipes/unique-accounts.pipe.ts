import { Pipe, PipeTransform } from '@angular/core';
import { Account } from '@app/interfaces/account';
import { AccountDisplay } from '@app/interfaces/account-display';

@Pipe({
  name: 'uniqueAccounts',
  standalone: true,
})
export class UniqueAccountsPipe implements PipeTransform {
  transform(accounts: AccountDisplay[]): AccountDisplay[] {
    // Remove duplicate accounts by card_type
    return accounts.filter(
      (account, index) =>
        index === accounts.findIndex((t) => t.card_type === account.card_type),
    );
  }
}
