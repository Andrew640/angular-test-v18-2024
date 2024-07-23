import { TestBed } from '@angular/core/testing';

import { ClientsService } from './clients.service';
import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';
import { provideHttpClient } from '@angular/common/http';
import { Client } from '@app/interfaces/client';
import { of, throwError } from 'rxjs';
import { DataService } from '../data/data.service';
import { LoadingService } from '../loading/loading.service';

fdescribe('ClientsService', () => {
  let service: ClientsService;
  let mockDataService: jasmine.SpyObj<DataService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  const mockClients: Client[] = [
    {
      id: '608572d363b913700be09a41',
      name: 'Simpson',
      firstname: 'Bart',
      address: 'SpringField, USA',
      created: '2021-04-25 13:46:59+00:00',
      birthday: '1995-04-14 13:25:14',
      accounts: ['6084118399e57e9b1e12ac45', '6084122499e57e9b1e12ac47'],
    },
  ];

  const mockAccounts = [
    {
      id: '6084118399e57e9b1e12ac45',
      card_type: 'VISA',
      number: 402400,
      balance: 100,
      created: '2021-04-24 12:39:31+00:00',
    },
    {
      id: '6084122499e57e9b1e12ac47',
      card_type: 'MasterCard',
      number: 405400,
      balance: 200,
      created: '2021-04-24 12:42:12+00:00',
    },
  ];

  beforeEach(() => {
    mockDataService = jasmine.createSpyObj('DataService', [
      'getClientsData',
      'getAccountsData',
    ]);
    mockDataService.getClientsData.and.returnValue(of(mockClients));
    mockDataService.getAccountsData.and.returnValue(of(mockAccounts));

    mockLoadingService = jasmine.createSpyObj('LoadingService', [
      'setLoadingClients',
      'setLoadingAccounts',
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: DataService, useValue: mockDataService },
        { provide: LoadingService, useValue: mockLoadingService },
      ],
    });
    service = TestBed.inject(ClientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('accountsMap', () => {
    it('should return an object with account id as key and account object as value', () => {
      const accounts = [
        {
          id: '6084118399e57e9b1e12ac45',
          card_type: 'VISA',
          number: 402400,
          balance: 100,
          created: '2021-04-24 12:39:31+00:00',
          display: true,
          name: 'Account 1',
        },
        {
          id: '6084122499e57e9b1e12ac47',
          card_type: 'MasterCard',
          number: 405400,
          balance: 200,
          created: '2021-04-24 12:42:12+00:00',
          display: true,
          name: 'Account 2',
        },
      ];
      const accountsMap = {
        '6084118399e57e9b1e12ac45': {
          id: '6084118399e57e9b1e12ac45',
          card_type: 'VISA',
          number: 402400,
          balance: 100,
          created: '2021-04-24 12:39:31+00:00',
          display: true,
          name: 'Account 1',
        },
        '6084122499e57e9b1e12ac47': {
          id: '6084122499e57e9b1e12ac47',
          card_type: 'MasterCard',
          number: 405400,
          balance: 200,
          created: '2021-04-24 12:42:12+00:00',
          display: true,
          name: 'Account 2',
        },
      };
      const result = service['accountsMap'](accounts);
      expect(result).toEqual(accountsMap);
    });
  });

  describe('getClientsWithAccountsData', () => {
    it('should return an Observable of ClientWithAccounts[]', () => {
      service.getClientsWithAccountsData().subscribe((data) => {
        expect(data).toEqual([]);
      });
    });
  });

  describe('toggleClientAccountsDisplay', () => {
    it('should toggle client accounts to display by cardType', () => {
      const clientId = '608572d363b913700be09a41';
      const cardType = 'VISA';
      const allClients: ClientWithAccounts[] = [
        {
          id: '608572d363b913700be09a41',
          name: 'Simpson',
          firstname: 'Bart',
          address: 'SpringField, USA',
          created: '2021-04-25 13:46:59+00:00',
          birthday: '1995-04-14 13:25:14',
          display: true,
          accounts: [
            {
              id: '6084118399e57e9b1e12ac45',
              card_type: 'VISA',
              number: 402400,
              balance: 100,
              created: '2021-04-24 12:39:31+00:00',
              display: true,
              name: 'Account 1',
            },
            {
              id: '6084122499e57e9b1e12ac47',
              card_type: 'MasterCard',
              number: 405400,
              balance: 200,
              created: '2021-04-24 12:42:12+00:00',
              display: true,
              name: 'Account 2',
            },
          ],
        },
      ];
      const clientsFiltered: ClientWithAccounts[] = [
        {
          id: '608572d363b913700be09a41',
          name: 'Simpson',
          firstname: 'Bart',
          address: 'SpringField, USA',
          created: '2021-04-25 13:46:59+00:00',
          birthday: '1995-04-14 13:25:14',
          display: true,
          accounts: [
            {
              id: '6084118399e57e9b1e12ac45',
              card_type: 'VISA',
              number: 402400,
              balance: 100,
              created: '2021-04-24 12:39:31+00:00',
              display: false,
              name: 'Account 1',
            },
            {
              id: '6084122499e57e9b1e12ac47',
              card_type: 'MasterCard',
              number: 405400,
              balance: 200,
              created: '2021-04-24 12:42:12+00:00',
              display: true,
              name: 'Account 2',
            },
          ],
        },
      ];
      service['clientsWithAccountsData'].next(allClients);
      service.toggleClientAccountsDisplay(clientId, cardType);
      service['clientsWithAccountsData'].subscribe((data) => {
        expect(data).toEqual(clientsFiltered);
      });
    });
  });

  describe('searchClients', () => {
    const allClients: ClientWithAccounts[] = [
      {
        id: '608572d363b913700be09a41',
        name: 'Simpson',
        firstname: 'Bart',
        address: 'SpringField, USA',
        created: '2021-04-25 13:46:59+00:00',
        birthday: '1995-04-14 13:25:14',
        display: true,
        accounts: [],
      },
      {
        id: '608be94d2986514c3d5fa3b3',
        name: 'OReilly32',
        firstname: 'Brian',
        address: '4584 Sunny Day Drive, Irvine, CA',
        created: '2021-04-30 11:26:05+00:00',
        birthday: '1989-05-23 13:25:14',
        display: true,
        accounts: [],
      },
    ];

    it('should search clients when string provided', () => {
      const searchTerm = 'bart';
      const clientsFiltered: ClientWithAccounts[] = [
        {
          id: '608572d363b913700be09a41',
          name: 'Simpson',
          firstname: 'Bart',
          address: 'SpringField, USA',
          created: '2021-04-25 13:46:59+00:00',
          birthday: '1995-04-14 13:25:14',
          display: true,
          accounts: [],
        },
        {
          id: '608be94d2986514c3d5fa3b3',
          name: 'OReilly32',
          firstname: 'Brian',
          address: '4584 Sunny Day Drive, Irvine, CA',
          created: '2021-04-30 11:26:05+00:00',
          birthday: '1989-05-23 13:25:14',
          display: false,
          accounts: [],
        },
      ];
      service['clientsWithAccountsData'].next(allClients);
      service.searchClients(searchTerm);
      service['clientsWithAccountsData'].subscribe((data) => {
        expect(data).toEqual(clientsFiltered);
      });
    });

    it('should search clients when empty string', () => {
      const searchTerm = '';
      service['clientsWithAccountsData'].next(allClients);
      service.searchClients(searchTerm);
      service['clientsWithAccountsData'].subscribe((data) => {
        expect(data).toEqual(allClients);
      });
    });
  });

  describe('updateClientsWithAccountsData', () => {
    it('should update clients with accounts data when client has accounts', () => {
      const clients: Client[] = [
        {
          id: '608572d363b913700be09a41',
          name: 'Simpson',
          firstname: 'Bart',
          address: 'SpringField, USA',
          created: '2021-04-25 13:46:59+00:00',
          birthday: '1995-04-14 13:25:14',
          accounts: ['6084118399e57e9b1e12ac45', '6084122499e57e9b1e12ac47'],
        },
      ];
      const accounts = [
        {
          id: '6084118399e57e9b1e12ac45',
          card_type: 'VISA',
          number: 402400,
          balance: 100,
          created: '2021-04-24 12:39:31+00:00',
          display: true,
          name: 'Account 1',
        },
        {
          id: '6084122499e57e9b1e12ac47',
          card_type: 'MasterCard',
          number: 405400,
          balance: 200,
          created: '2021-04-24 12:42:12+00:00',
          display: true,
          name: 'Account 2',
        },
      ];

      const clientsWithAccounts: ClientWithAccounts[] = [
        {
          id: '608572d363b913700be09a41',
          name: 'Simpson',
          firstname: 'Bart',
          address: 'SpringField, USA',
          created: '2021-04-25 13:46:59+00:00',
          birthday: '1995-04-14 13:25:14',
          display: true,
          accounts: [
            {
              id: '6084118399e57e9b1e12ac45',
              card_type: 'VISA',
              number: 402400,
              balance: 100,
              created: '2021-04-24 12:39:31+00:00',
              display: true,
              name: 'Account 1',
            },
            {
              id: '6084122499e57e9b1e12ac47',
              card_type: 'MasterCard',
              number: 405400,
              balance: 200,
              created: '2021-04-24 12:42:12+00:00',
              display: true,
              name: 'Account 2',
            },
          ],
        },
      ];

      spyOn(service['accountService'], 'getAccounts').and.returnValue(
        of(accounts),
      );

      service['updateClientsWithAccountsData'](clients);
      service['clientsWithAccountsData'].subscribe((data) => {
        expect(data).toEqual(clientsWithAccounts);
      });
    });

    it('should update clients with accounts data when client has accounts', () => {
      const clients: Client[] = [
        {
          id: '608572d363b913700be09a41',
          name: 'Simpson',
          firstname: 'Bart',
          address: 'SpringField, USA',
          created: '2021-04-25 13:46:59+00:00',
          birthday: '1995-04-14 13:25:14',
          accounts: [],
        },
      ];
      const clientsWithAccounts: ClientWithAccounts[] = [
        {
          id: '608572d363b913700be09a41',
          name: 'Simpson',
          firstname: 'Bart',
          address: 'SpringField, USA',
          created: '2021-04-25 13:46:59+00:00',
          birthday: '1995-04-14 13:25:14',
          display: true,
          accounts: [],
        },
      ];

      spyOn(service['accountService'], 'getAccounts').and.returnValue(of([]));

      service['updateClientsWithAccountsData'](clients);
      service['clientsWithAccountsData'].subscribe((data) => {
        expect(data).toEqual(clientsWithAccounts);
      });
    });
  });

  describe('cleanClientsAndMapAccounts', () => {
    it('should remove clients where first name is TEST CRASH', () => {
      const result: ClientWithAccounts[] = [];
      const client: Client = {
        id: '608572d363b913700be09a41',
        name: 'Simpson',
        firstname: 'TEST CRASH',
        address: 'SpringField, USA',
        created: '2021-04-25 13:46:59+00:00',
        birthday: '1995-04-14 13:25:14',
        accounts: ['6084118399e57e9b1e12ac45', '6084122499e57e9b1e12ac47'],
      };
      const resultAfterClientClean = service['cleanClientsAndMapAccounts'](
        result,
        client,
        {},
      );
      expect(resultAfterClientClean).toEqual([]);
    });

    it('should map accounts to the client when client firstname is not TEST CRASH', () => {
      const result: ClientWithAccounts[] = [];
      const client: Client = {
        id: '608572d363b913700be09a41',
        name: 'Simpson',
        firstname: 'Bart',
        address: 'SpringField, USA',
        created: '2021-04-25 13:46:59+00:00',
        birthday: '1995-04-14 13:25:14',
        accounts: ['6084118399e57e9b1e12ac45', '6084122499e57e9b1e12ac47'],
      };
      const accountMap = {
        '6084118399e57e9b1e12ac45': {
          id: '6084118399e57e9b1e12ac45',
          card_type: 'VISA',
          number: 402400,
          balance: 100,
          created: '2021-04-24 12:39:31+00:00',
          display: true,
          name: 'Account 1',
        },
        '6084122499e57e9b1e12ac47': {
          id: '6084122499e57e9b1e12ac47',
          card_type: 'MasterCard',
          number: 405400,
          balance: 200,
          created: '2021-04-24 12:42:12+00:00',
          display: true,
          name: 'Account 2',
        },
      };
      const clientWithAccounts: ClientWithAccounts[] = [
        {
          id: '608572d363b913700be09a41',
          name: 'Simpson',
          firstname: 'Bart',
          address: 'SpringField, USA',
          created: '2021-04-25 13:46:59+00:00',
          birthday: '1995-04-14 13:25:14',
          display: true,
          accounts: [
            {
              id: '6084118399e57e9b1e12ac45',
              card_type: 'VISA',
              number: 402400,
              balance: 100,
              created: '2021-04-24 12:39:31+00:00',
              display: true,
              name: 'Account 1',
            },
            {
              id: '6084122499e57e9b1e12ac47',
              card_type: 'MasterCard',
              number: 405400,
              balance: 200,
              created: '2021-04-24 12:42:12+00:00',
              display: true,
              name: 'Account 2',
            },
          ],
        },
      ];
      const resultAfterAccountsMapped = service['cleanClientsAndMapAccounts'](
        result,
        client,
        accountMap,
      );
      expect(resultAfterAccountsMapped).toEqual(clientWithAccounts);
    });
  });

  // private loadClientsData(): void {
  //   this.loadingService.setLoadingClients(true);
  //   this.clientsDataSubscription = this.dataService
  //     .getClientsData()
  //     .pipe(
  //       tap((data) => this.updateClientsWithAccountsData(data)),
  //       catchError((error) => {
  //         console.error('Error loading client data', error);
  //         return of([]);
  //       }),
  //     )
  //     .subscribe({
  //       next: () => {
  //         this.loadingService.setLoadingClients(false);
  //       },
  //       error: (error) => {
  //         this.loadingService.setLoadingClients(false);
  //         console.error('Error encountered during subscription', error);
  //       },
  //     });
  // }

  describe('loadClientsData', () => {
    it('should load clients data and set loading to false', () => {
      spyOn<any>(service, 'updateClientsWithAccountsData');
      expect(service['loadingService'].setLoadingClients).toHaveBeenCalledWith(
        true,
      );
    });

    it('should throw an error and set loading to false', () => {
      mockDataService.getAccountsData.and.returnValue(
        throwError(() => new Error('Error')),
      );
      spyOn(console, 'error');
      service['loadClientsData']();
      expect(service['loadingService'].setLoadingClients).toHaveBeenCalledWith(
        false,
      );
      expect(console.error).toHaveBeenCalled();
    });
  });
});
