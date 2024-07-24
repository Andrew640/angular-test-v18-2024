import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';

export const clientsWithAccountsMock: ClientWithAccounts[] = [
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
