import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Client } from '@app/interfaces/client';
import { Account } from '@app/interfaces/account';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl: string = 'https://api-ashen-chi.vercel.app/api';

  constructor(private http: HttpClient) {}

  public getAccountsData(): Observable<Account[]> {
    return this.http
      .get<Account[]>(`${this.apiUrl}/accounts`)
      .pipe(catchError(this.handleError));
  }

  public getClientsData(): Observable<Client[]> {
    return this.http
      .get<Client[]>(`${this.apiUrl}/clientsrefgt`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Server error:', error);
    let errorMessage = 'An unexpected error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code ${error.status}, error message is: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
