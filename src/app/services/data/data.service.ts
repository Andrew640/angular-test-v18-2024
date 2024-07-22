import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '@app/interfaces/client';
import { Account } from '@app/interfaces/account';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl: string = 'https://api-ashen-chi.vercel.app/api';

  constructor(private http: HttpClient) {}

  public getAccountsData(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/accounts`);
  }

  public getClientsData(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients`);
  }
}
