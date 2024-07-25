import { TestBed } from '@angular/core/testing';

import { AccountsService } from './accounts.service';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { DataService } from '../data/data.service';
import { LoadingService } from '../loading/loading.service';
import { Account } from '@app/interfaces/account';

describe('AccountsService', () => {
  let service: AccountsService;
  let mockDataService: jasmine.SpyObj<DataService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  const mockAccounts: Account[] = [
    {
      id: '608577dc5bcabe685f68eb16',
      card_type: 'VISA',
      number: 412400,
      balance: -100,
      created: '2021-04-25 14:08:28+00:00',
    },
    {
      id: '6084118399e57e9b1e12ac45',
      card_type: 'VISA',
      number: 402400,
      balance: 100,
      created: '2021-04-24 12:39:31+00:00',
    },
  ];

  beforeEach(() => {
    mockDataService = jasmine.createSpyObj('DataService', ['getAccountsData']);
    mockDataService.getAccountsData.and.returnValue(of(mockAccounts));

    mockLoadingService = jasmine.createSpyObj('LoadingService', [
      'setLoadingAccounts',
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: DataService, useValue: mockDataService },
        { provide: LoadingService, useValue: mockLoadingService },
      ],
    });
    service = TestBed.inject(AccountsService);
    service.getAccounts;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an Observable of Account[]', () => {
    service.getAccounts().subscribe((data) => {
      expect(data).toEqual(mockAccounts);
    });
  });

  describe('loadAccountsData', () => {
    it('should load account data and set loading to false', () => {
      spyOn(service['accounts'], 'next');
      service['loadAccountsData']();
      expect(service['loadingService'].setLoadingAccounts).toHaveBeenCalledWith(
        true,
      );
    });

    it('should throw an error and set loading to false', () => {
      mockDataService.getAccountsData.and.returnValue(
        throwError(() => new Error('Error')),
      );
      spyOn(console, 'error');
      service['loadAccountsData']();
      expect(service['loadingService'].setLoadingAccounts).toHaveBeenCalledWith(
        false,
      );
      expect(console.error).toHaveBeenCalled();
    });
  });
});
