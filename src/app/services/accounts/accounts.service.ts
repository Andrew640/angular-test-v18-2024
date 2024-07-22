import { Injectable, OnDestroy } from '@angular/core';
import { Account } from '@app/interfaces/account';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
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
      .pipe(tap((data) => this.accounts.next(data)))
      .subscribe(() => this.loadingService.setLoadingAccounts(false));
  }

  public ngOnDestroy(): void {
    this.accountsDataSubscription.unsubscribe();
  }
}
