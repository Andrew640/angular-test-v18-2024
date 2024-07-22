import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Account } from '@app/interfaces/account';
import { Client } from '@app/interfaces/client';
import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DataService } from '../data/data.service';
import { LoadingService } from '../loading/loading.service';
import { AccountsService } from '../accounts/accounts.service';

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
          display: true,
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

  public filterClientAccounts(clientId: string, cardType: string): void {
    const allClients = this.clientsWithAccountsData.getValue();
    const updatedClients = allClients.map((client) => {
      if (client.id === clientId) {
        const updatedAccounts = client.accounts.map((account) => ({
          ...account,
          display:
            account.card_type === cardType ? !account.display : account.display,
        }));
        return { ...client, accounts: updatedAccounts };
      }
      return client;
    });
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
      const clientAccounts: Account[] = [];
      client.accounts.forEach((accountId, i) => {
        const account = accountMap[accountId];
        if (account) {
          clientAccounts.push({ ...account, name: `Account ${i + 1}` });
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
      .pipe(tap((data) => this.updateClientsWithAccountsData(data)))
      .subscribe(() => this.loadingService.setLoadingClients(false));
  }

  public ngOnDestroy(): void {
    this.clientsDataSubscription.unsubscribe();
  }
}
