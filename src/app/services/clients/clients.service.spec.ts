import { TestBed } from '@angular/core/testing';

import { ClientsService } from './clients.service';
import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';
import { provideHttpClient } from '@angular/common/http';
import { Client } from '@app/interfaces/client';
import { of, throwError } from 'rxjs';
import { DataService } from '../data/data.service';
import { LoadingService } from '../loading/loading.service';
import { clientsWithAccountsMock } from '@app/mocks/clients-with-accounts';
import { accountsMock } from '@app/mocks/accounts';
import { clientsMock } from '@app/mocks/clients';
import { accountsDisplayMock } from '@app/mocks/accounts-display';

describe('ClientsService', () => {
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
      const accountsMap = {
        '608577dc5bcabe685f68eb16': {
          id: '608577dc5bcabe685f68eb16',
          card_type: 'VISA',
          number: 412400,
          balance: -100,
          created: '2021-04-25 14:08:28+00:00',
          display: true,
          name: 'Account 1',
        },
        '6084118399e57e9b1e12ac45': {
          id: '6084118399e57e9b1e12ac45',
          card_type: 'VISA',
          number: 402400,
          balance: 100,
          created: '2021-04-24 12:39:31+00:00',
          display: true,
          name: 'Account 2',
        },
        '6084122499e57e9b1e12ac47': {
          id: '6084122499e57e9b1e12ac47',
          card_type: 'MasterCard',
          number: 405400,
          balance: 200,
          created: '2021-04-24 12:42:12+00:00',
          display: true,
          name: 'Account 3',
        },
      };
      const result = service['accountsMap'](accountsDisplayMock);
      expect(result).toEqual(accountsMap);
    });
  });

  describe('getClientsWithAccountsData', () => {
    it('should return an Observable of ClientWithAccounts[]', () => {
      service.getClientsWithAccountsData().subscribe((data) => {
        expect(data).toEqual(clientsWithAccountsMock);
      });
    });
  });

  describe('toggleClientAccountsDisplay', () => {
    it('should toggle client accounts to display by cardType', () => {
      const clientId = '608572d363b913700be09a41';
      const cardType = 'VISA';
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
      service['clientsWithAccountsData'].next(clientsWithAccountsMock);
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
      spyOn(service['accountService'], 'getAccounts').and.returnValue(
        of(accountsMock),
      );

      service['updateClientsWithAccountsData'](clientsMock);
      service['clientsWithAccountsData'].subscribe((data) => {
        expect(data).toEqual(clientsWithAccountsMock);
      });
    });

    it('should update clients with accounts data when client has no accounts', () => {
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
      const resultAfterAccountsMapped = service['cleanClientsAndMapAccounts'](
        result,
        client,
        accountMap,
      );
      expect(resultAfterAccountsMapped).toEqual(clientsWithAccountsMock);
    });
  });

  describe('loadClientsData', () => {
    it('should load clients data and set loading to true and then to false', () => {
      const updateSpy = spyOn<any>(
        service,
        'updateClientsWithAccountsData',
      ).and.callThrough();
      service['loadClientsData']();

      expect(mockLoadingService.setLoadingClients).toHaveBeenCalledWith(true);
      expect(mockLoadingService.setLoadingClients).toHaveBeenCalledWith(false);
      expect(updateSpy).toHaveBeenCalled();
    });

    it('should throw an error and set loading to false', () => {
      const errorResponse = new Error('Data fetch failed');
      mockDataService.getClientsData.and.returnValue(
        throwError(() => errorResponse),
      );
      spyOn(console, 'error');
      service['loadClientsData']();

      expect(mockLoadingService.setLoadingClients).toHaveBeenCalledWith(true);
      expect(mockLoadingService.setLoadingClients).toHaveBeenCalledWith(false);
      expect(console.error).toHaveBeenCalledWith(
        'Error loading client data',
        jasmine.any(Error),
      );
    });
  });
});
