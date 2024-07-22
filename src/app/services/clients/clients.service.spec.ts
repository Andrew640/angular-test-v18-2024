import { TestBed } from '@angular/core/testing';

import { ClientsService } from './clients.service';
import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';
import { HttpClientModule } from '@angular/common/http';

fdescribe('ClientsService', () => {
  let service: ClientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Include HttpClientModule in your test module
    });
    service = TestBed.inject(ClientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // public getClientsWithAccountsData(): Observable<ClientWithAccounts[]> {
  //   return this.clientsWithAccountsData;
  // }

  it('should return an Observable of ClientWithAccounts[]', () => {
    service.getClientsWithAccountsData().subscribe((data) => {
      expect(data).toEqual([]);
    });
  });

  // public filterClientAccounts(clientId: string, cardType: string): void {
  //   const allClients = this.clientsWithAccountsData.getValue();
  //   const updatedClients = allClients.map((client) => {
  //     if (client.id === clientId) {
  //       const updatedAccounts = client.accounts.map((account) => ({
  //         ...account,
  //         display:
  //           account.card_type === cardType ? !account.display : account.display,
  //       }));
  //       return { ...client, accounts: updatedAccounts };
  //     }
  //     return client;
  //   });
  //   this.clientsWithAccountsData.next(updatedClients);
  // }

  it('should filter client accounts', () => {
    const clientId = '1';
    const cardType = 'debit';
    const allClients: ClientWithAccounts[] = [
      {
        id: '608572d363b913700be09a41',
        name: 'Simpson',
        firstname: 'Bart',
        address: 'SpringField, USA',
        created: '2021-04-25 13:46:59+00:00',
        birthday: '1995-04-14 13:25:14',
        display: false,
        accounts: [
          {
            id: '6084118399e57e9b1e12ac45',
            card_type: 'VISA',
            number: 402400,
            balance: 100,
            created: '2021-04-24 12:39:31+00:00',
            display: false,
            name: '',
          },
          {
            id: '6084118399e57e9b1e12ac45',
            card_type: 'VISA',
            number: 402400,
            balance: 100,
            created: '2021-04-24 12:39:31+00:00',
            display: false,
            name: '',
          },
          {
            id: '6084122499e57e9b1e12ac47',
            card_type: 'MasterCard',
            number: 405400,
            balance: 200,
            created: '2021-04-24 12:42:12+00:00',
            display: false,
            name: '',
          },
        ],
      },
      {
        id: '608572d363b913700be09a42',
        name: 'Simpson2',
        firstname: 'Bart',
        address: 'SpringField, USA',
        created: '2021-04-25 13:46:59+00:00',
        birthday: '1995-04-14 13:25:14',
        display: false,
        accounts: [
          {
            id: '6084118399e57e9b1e12ac45',
            card_type: 'VISA',
            number: 402400,
            balance: 100,
            created: '2021-04-24 12:39:31+00:00',
            display: false,
            name: '',
          },
          {
            id: '6084122499e57e9b1e12ac47',
            card_type: 'MasterCard',
            number: 405400,
            balance: 200,
            created: '2021-04-24 12:42:12+00:00',
            display: false,
            name: '',
          },
          {
            id: '6084122499e57e9b1e12ac47',
            card_type: 'MasterCard',
            number: 405400,
            balance: 200,
            created: '2021-04-24 12:42:12+00:00',
            display: false,
            name: '',
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
        display: false,
        accounts: [
          {
            id: '6084118399e57e9b1e12ac45',
            card_type: 'VISA',
            number: 402400,
            balance: 100,
            created: '2021-04-24 12:39:31+00:00',
            display: false,
            name: '',
          },
          {
            id: '6084122499e57e9b1e12ac47',
            card_type: 'MasterCard',
            number: 405400,
            balance: 200,
            created: '2021-04-24 12:42:12+00:00',
            display: false,
            name: '',
          },
        ],
      },
      {
        id: '608572d363b913700be09a42',
        name: 'Simpson2',
        firstname: 'Bart',
        address: 'SpringField, USA',
        created: '2021-04-25 13:46:59+00:00',
        birthday: '1995-04-14 13:25:14',
        display: false,
        accounts: [
          {
            id: '6084118399e57e9b1e12ac45',
            card_type: 'VISA',
            number: 402400,
            balance: 100,
            created: '2021-04-24 12:39:31+00:00',
            display: false,
            name: '',
          },
          {
            id: '6084122499e57e9b1e12ac47',
            card_type: 'MasterCard',
            number: 405400,
            balance: 200,
            created: '2021-04-24 12:42:12+00:00',
            display: false,
            name: '',
          },
        ],
      },
    ];
    service['clientsWithAccountsData'].next(allClients);
    service.filterClientAccounts(clientId, cardType);
    service['clientsWithAccountsData'].subscribe((data) => {
      expect(data).toEqual(clientsFiltered);
    });
  });
});
