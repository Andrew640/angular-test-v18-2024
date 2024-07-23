import { Injectable, OnDestroy } from '@angular/core';
import { Account } from '@app/interfaces/account';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  of,
  tap,
} from 'rxjs';
import { DataService } from '../data/data.service';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsService implements OnDestroy {
  private accountsDataSubscription: Subscription = new Subscription();
  private accounts: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>(
    [],
  );

  public constructor(
    public dataService: DataService,
    public loadingService: LoadingService,
  ) {
    this.loadAccountsData();
  }

  public getAccounts(): Observable<Account[]> {
    return this.accounts.asObservable();
  }

  private loadAccountsData(): void {
    this.loadingService.setLoadingAccounts(true);
    this.accountsDataSubscription = this.dataService
      .getAccountsData()
      .pipe(
        tap((data) => this.accounts.next(data)),
        catchError((error) => {
          console.error('Error loading account data', error);
          return of([]);
        }),
      )
      .subscribe({
        next: () => {
          this.loadingService.setLoadingAccounts(false);
        },
        error: (error) => {
          this.loadingService.setLoadingAccounts(false);
          console.error('Error encountered during subscription', error);
        },
      });
  }

  public ngOnDestroy(): void {
    this.accountsDataSubscription.unsubscribe();
  }
}
