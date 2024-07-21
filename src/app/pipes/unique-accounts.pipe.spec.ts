import { UniqueAccountsPipe } from './unique-accounts.pipe';

describe('UniqueAccountsPipe', () => {
  it('create an instance', () => {
    const pipe = new UniqueAccountsPipe();
    expect(pipe).toBeTruthy();
  });
});
