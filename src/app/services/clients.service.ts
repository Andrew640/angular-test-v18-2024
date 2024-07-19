import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Account } from '@app/interfaces/account';
import { Client } from '@app/interfaces/client';
import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  forkJoin,
} from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

// TODO: put accounts in new service and maybe put http requests in a separate service too
export class ClientsService implements OnDestroy {
  private accountsData: BehaviorSubject<Account[]> = new BehaviorSubject<
    Account[]
  >([]);
  private clientsData: BehaviorSubject<Client[]> = new BehaviorSubject<
    Client[]
  >([]);

  private accountsDataSubscription: Subscription = new Subscription();
  private clientsDataSubscription: Subscription = new Subscription();

  private isAccountsDataLoading: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  private isClientsDataLoading: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  public isLoading: Observable<boolean> = forkJoin([
    this.isAccountsDataLoading,
    this.isClientsDataLoading,
  ]).pipe(
    map(
      ([isAccountsDataLoading, isClientsDataLoading]) =>
        isAccountsDataLoading || isClientsDataLoading,
    ),
  );

  constructor(private http: HttpClient) {
    this.loadAccountsData();
    this.loadClientsData();
  }

  public getAccountsData(): Observable<Account[]> {
    return this.accountsData;
  }

  public getClientsWithAccountsData(): Observable<ClientWithAccounts[]> {
    return this.clientsData.pipe(
      map((clients: Client[]) =>
        clients.filter(
          (client: Client) =>
            client.firstname && client.firstname !== 'TEST CRASH',
        ),
      ),
      switchMap((clients) =>
        this.getAccountsData().pipe(
          map((accounts: Account[]) =>
            clients.map((client: Client) => ({
              ...client,
              accounts:
                accounts &&
                accounts.filter((account: Account) =>
                  client.accounts.includes(account.id),
                ),
            })),
          ),
        ),
      ),
    );
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
      .pipe(tap((data) => this.clientsData.next(data)))
      .subscribe(() => this.isClientsDataLoading.next(false));
  }

  public ngOnDestroy(): void {
    this.accountsDataSubscription.unsubscribe();
    this.clientsDataSubscription.unsubscribe();
  }
}
