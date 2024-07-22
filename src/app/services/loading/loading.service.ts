import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private isAccountsDataLoading: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  private isClientsDataLoading: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  constructor() {}

  public setLoadingAccounts(loading: boolean): void {
    this.isAccountsDataLoading.next(loading);
  }

  public setLoadingClients(loading: boolean): void {
    this.isClientsDataLoading.next(loading);
  }

  public isLoading(): Observable<boolean> {
    return combineLatest([
      this.isAccountsDataLoading,
      this.isClientsDataLoading,
    ]).pipe(
      map(
        ([accountsLoading, clientsLoading]) =>
          accountsLoading || clientsLoading,
      ),
    );
  }
}
