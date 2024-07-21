// import { HttpClient } from '@angular/common/http';
// import { Injectable, OnDestroy } from '@angular/core';
// import { Account } from '@app/interfaces/account';
// import { Client } from '@app/interfaces/client';
// import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';
// import {
//   BehaviorSubject,
//   Observable,
//   Subject,
//   Subscription,
//   forkJoin,
// } from 'rxjs';
// import { map, switchMap, tap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })

// // TODO: put accounts in new service and maybe put http requests in a separate service too
// export class ClientsService implements OnDestroy {
//   private accountsData: BehaviorSubject<Account[]> = new BehaviorSubject<
//     Account[]
//   >([]);
//   private clientsData: BehaviorSubject<Client[]> = new BehaviorSubject<
//     Client[]
//   >([]);
//   private clientsDataWithAccounts: BehaviorSubject<ClientWithAccounts[]> = new BehaviorSubject<
//   ClientWithAccounts[]
//   >([]);

//   private accountsDataSubscription: Subscription = new Subscription();
//   private clientsDataSubscription: Subscription = new Subscription();

//   private isAccountsDataLoading: BehaviorSubject<boolean> =
//     new BehaviorSubject<boolean>(true);
//   private isClientsDataLoading: BehaviorSubject<boolean> =
//     new BehaviorSubject<boolean>(true);

//   public isLoading: Observable<boolean> = forkJoin([
//     this.isAccountsDataLoading,
//     this.isClientsDataLoading,
//   ]).pipe(
//     map(
//       ([isAccountsDataLoading, isClientsDataLoading]) =>
//         isAccountsDataLoading || isClientsDataLoading,
//     ),
//   );

//   constructor(private http: HttpClient) {
//     this.loadAccountsData();
//     this.loadClientsData();
//   }

//   public getAccountsData(): Observable<Account[]> {
//     return this.accountsData;
//   }

//   // public getClientsWithAccountsData(): Observable<ClientWithAccounts[]> {
//   //   return this.clientsData.pipe(
//   //     map((clients: Client[]) =>
//   //       clients.filter(
//   //         (client: Client) =>
//   //           client.firstname && client.firstname !== 'TEST CRASH',
//   //       ),
//   //     ),
//   //     switchMap((clients) =>
//   //       this.getAccountsData().pipe(
//   //         map((accounts: Account[]) =>
//   //           clients.map((client: Client) => ({
//   //             ...client,
//   //             accounts:
//   //               accounts &&
//   //               accounts.filter((account: Account) =>
//   //                 client.accounts.includes(account.id),
//   //               ),
//   //           })),
//   //         ),
//   //       ),
//   //     ),
//   //   );
//   // }

//   public modifyClientsWithAccountsData(): Observable<ClientWithAccounts[]> {
//     this.clientsDataWithAccounts = this.clientsData.pipe(
//       switchMap((clients: Client[]) =>
//         this.getAccountsData().pipe(
//           map((accounts: Account[]) => {
//             // Create a map of accounts with the new property added
//             const accountMap = accounts.reduce(
//               (acc, account) => {
//                 acc[account.id] = { ...account, display: true };
//                 return acc;
//               },
//               {} as { [key: string]: Account & { display: boolean } },
//             );

//             // Combine filtering and mapping of clients
//             return clients.reduce((result, client) => {
//               if (client.firstname && client.firstname !== 'TEST CRASH') {
//                 const clientAccounts: Account[] = [];
//                 for (const accountId of client.accounts) {
//                   const account = accountMap[accountId];
//                   if (account) {
//                     clientAccounts.push(account);
//                   }
//                 }
//                 result.push({
//                   ...client,
//                   accounts: clientAccounts,
//                 });
//               }
//               return result;
//             }, [] as ClientWithAccounts[]);
//           }),
//         ),
//       ),
//     );
//   }

//   public filterAccounts(clientId: string, accountId: string): void {
//     this.clientsData.pipe(
//       map((clients) => clients.find((client) => client.id === clientId)),
//       map((client) =>
//         client.accounts.map((account) => {
//           if (account.id === accountId) {
//             account.display = !account.display;
//           }
//           return account;
//         }),
//       ),
//     );
//   }

//   private loadAccountsData(): void {
//     this.isAccountsDataLoading.next(true);
//     this.accountsDataSubscription = this.http
//       .get<Account[]>('https://api-ashen-chi.vercel.app/api/accounts')
//       .pipe(tap((data) => this.accountsData.next(data)))
//       .subscribe(() => this.isAccountsDataLoading.next(false));
//   }

//   private loadClientsData(): void {
//     this.isClientsDataLoading.next(true);
//     this.clientsDataSubscription = this.http
//       .get<Client[]>('https://api-ashen-chi.vercel.app/api/clients')
//       .pipe(tap((data) => this.clientsData.next(data)))
//       .subscribe(() => this.isClientsDataLoading.next(false));
//   }

//   public ngOnDestroy(): void {
//     this.accountsDataSubscription.unsubscribe();
//     this.clientsDataSubscription.unsubscribe();
//   }
// }

import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Account } from '@app/interfaces/account';
import { Client } from '@app/interfaces/client';
import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  forkJoin,
} from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ClientsService implements OnDestroy {
  private accountsData: BehaviorSubject<Account[]> = new BehaviorSubject<
    Account[]
  >([]);
  private clientsWithAccountsData: BehaviorSubject<ClientWithAccounts[]> =
    new BehaviorSubject<ClientWithAccounts[]>([]);

  private accountsDataSubscription: Subscription = new Subscription();
  private clientsDataSubscription: Subscription = new Subscription();

  private isAccountsDataLoading: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  private isClientsDataLoading: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

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

  private isLoadingData: Observable<boolean> = combineLatest([
    this.isAccountsDataLoading,
    this.isClientsDataLoading,
  ]).pipe(
    map(
      ([isAccountsDataLoading, isClientsDataLoading]) =>
        isAccountsDataLoading || isClientsDataLoading,
    ),
  );

  public isLoading(): Observable<boolean> {
    return this.isLoadingData;
  }

  constructor(private http: HttpClient) {
    this.loadAccountsData();
    this.loadClientsData();
  }

  public getAccountsData(): Observable<Account[]> {
    return this.accountsData.asObservable();
  }

  public getClientsWithAccountsData(): Observable<ClientWithAccounts[]> {
    return this.clientsWithAccountsData;
  }

  public filterAccounts(clientId: string, cardType: string): void {
    const currentClients = this.clientsWithAccountsData.getValue();
    const updatedClients = currentClients.map((client) => {
      if (client.id === clientId) {
        const updatedAccounts = client.accounts.map((account) => {
          if (account.card_type === cardType) {
            return { ...account, display: !account.display };
          }
          return account;
        });

        return { ...client, accounts: updatedAccounts };
      }
      return client;
    });

    console.log(updatedClients);

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
    this.getAccountsData()
      .pipe(
        map((accounts: Account[]) => {
          // Create a map of accounts with the display property added
          const accountMap = this.accountsMap(accounts);

          // Remove test clients and map accounts with the display property to the clients
          return clients.reduce((result, client) => {
            return this.filterClientsAndMapAccounts(result, client, accountMap);
          }, [] as ClientWithAccounts[]);
        }),
      )
      .subscribe((clientsWithAccounts) => {
        this.clientsWithAccountsData.next(clientsWithAccounts);
      });
  }

  private filterClientsAndMapAccounts(
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

  private loadAccountsData(): void {
    this.isAccountsDataLoading.next(true);
    this.accountsDataSubscription = this.http
      .get<Account[]>('https://api-ashen-chi.vercel.app/api/accounts')
      .pipe(tap((data) => this.accountsData.next(data)))
      .subscribe(() => this.isAccountsDataLoading.next(false));
  }

  private loadClientsData(): void {
    this.isClientsDataLoading.next(true);
    this.clientsDataSubscription = this.http
      .get<Client[]>('https://api-ashen-chi.vercel.app/api/clients')
      .pipe(tap((data) => this.updateClientsWithAccountsData(data)))
      .subscribe(() => this.isClientsDataLoading.next(false));
  }

  public ngOnDestroy(): void {
    this.accountsDataSubscription.unsubscribe();
    this.clientsDataSubscription.unsubscribe();
  }
}
