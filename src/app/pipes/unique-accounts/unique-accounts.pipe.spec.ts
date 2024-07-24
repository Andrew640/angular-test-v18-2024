import { AccountDisplay } from '@app/interfaces/account-display';
import { UniqueAccountsPipe } from './unique-accounts.pipe';
import { accountsDisplayMock } from '@app/mocks/accounts-display';

describe('UniqueAccountsPipe', () => {
  let pipe: UniqueAccountsPipe;

  beforeEach(() => {
    pipe = new UniqueAccountsPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should filter unique accounts based on card_type', () => {
    const mockAccounts: AccountDisplay[] = accountsDisplayMock;
    const filteredAccounts = pipe.transform(mockAccounts);
    expect(filteredAccounts.length).toBe(2);
    expect(filteredAccounts).toEqual(
      jasmine.arrayContaining([
        jasmine.objectContaining({ card_type: 'VISA' }),
        jasmine.objectContaining({ card_type: 'MasterCard' }),
      ]),
    );
  });

  it('should return an empty array if no accounts are provided', () => {
    expect(pipe.transform([])).toEqual([]);
  });

  it('should handle arrays with a single element', () => {
    const singleAccount = accountsDisplayMock.slice(0, 1);
    const result = pipe.transform(singleAccount);
    expect(result).toEqual(singleAccount);
  });
});
