import { Injectable, OnDestroy } from '@angular/core';
import { Account } from '@app/interfaces/account';
import { Client } from '@app/interfaces/client';
import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DataService } from '../data/data.service';
import { LoadingService } from '../loading/loading.service';
import { AccountsService } from '../accounts/accounts.service';
import { AccountDisplay } from '@app/interfaces/account-display';

@Injectable({
  providedIn: 'root',
})
export class ClientsService implements OnDestroy {
  private clientsWithAccountsData: BehaviorSubject<ClientWithAccounts[]> =
    new BehaviorSubject<ClientWithAccounts[]>([]);

  private clientsDataSubscription: Subscription = new Subscription();

  private accountsMap = (accounts: Account[]) =>
    accounts.reduce(
      (acc, account) => {
        acc[account.id] = {
          ...account,
        };
        return acc;
      },
      {} as { [key: string]: Account },
    );

  constructor(
    public dataService: DataService,
    public accountService: AccountsService,
    public loadingService: LoadingService,
  ) {
    this.loadClientsData();
  }

  public getClientsWithAccountsData(): Observable<ClientWithAccounts[]> {
    return this.clientsWithAccountsData;
  }

  public toggleClientAccountsDisplay(clientId: string, cardType: string): void {
    const allClients = this.clientsWithAccountsData.getValue();
    const clientIndex = allClients.findIndex(
      (client) => client.id === clientId,
    );
    if (clientIndex === -1) return;

    const updatedClients = [...allClients];
    const client = updatedClients[clientIndex];
    const updatedAccounts = client.accounts.map((account) => ({
      ...account,
      display:
        account.card_type === cardType ? !account.display : account.display,
    }));

    updatedClients[clientIndex] = { ...client, accounts: updatedAccounts };

    this.clientsWithAccountsData.next(updatedClients);
  }

  public searchClients(searchTerm: string): void {
    const currentClients = this.clientsWithAccountsData.getValue();
    const updatedClients = currentClients.map((client) => {
      const shouldDisplay =
        !searchTerm ||
        client.firstname.toLowerCase().includes(searchTerm.toLowerCase());
      return { ...client, display: shouldDisplay };
    });
    this.clientsWithAccountsData.next(updatedClients);
  }

  private updateClientsWithAccountsData(clients: Client[]): void {
    this.accountService
      .getAccounts()
      .pipe(
        map((accounts: Account[]) => {
          // Create a map of accounts with the display property added
          const accountMap = this.accountsMap(accounts);
          // Remove test clients and map accounts with the display property to the clients
          return clients.reduce((result, client) => {
            return this.cleanClientsAndMapAccounts(result, client, accountMap);
          }, [] as ClientWithAccounts[]);
        }),
      )
      .subscribe((clientsWithAccounts) => {
        this.clientsWithAccountsData.next(clientsWithAccounts);
      });
  }

  private cleanClientsAndMapAccounts(
    result: ClientWithAccounts[],
    client: Client,
    accountMap: { [key: string]: Account },
  ): ClientWithAccounts[] {
    if (client.firstname && client.firstname !== 'TEST CRASH') {
      const clientAccounts: AccountDisplay[] = [];
      client.accounts.forEach((accountId, i) => {
        const account = accountMap[accountId];
        if (account) {
          clientAccounts.push({
            ...account,
            display: true,
            name: `Account ${i + 1}`,
          });
        }
      });
      result.push({
        ...client,
        display: true,
        accounts: clientAccounts,
      });
    }
    return result;
  }

  private loadClientsData(): void {
    this.loadingService.setLoadingClients(true);
    this.clientsDataSubscription = this.dataService
      .getClientsData()
      .pipe(
        tap((data) => this.updateClientsWithAccountsData(data)),
        catchError((error) => {
          console.error('Error loading client data', error);
          return of([]);
        }),
      )
      .subscribe({
        next: () => {
          this.loadingService.setLoadingClients(false);
        },
        error: (error) => {
          this.loadingService.setLoadingClients(false);
          console.error('Error encountered during subscription', error);
        },
      });
  }

  public ngOnDestroy(): void {
    this.clientsDataSubscription.unsubscribe();
  }
}
