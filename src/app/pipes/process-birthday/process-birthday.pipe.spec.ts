import { DatePipe } from '@angular/common';
import { ProcessBirthdayPipe } from './process-birthday.pipe';

describe('ProcessBirthdayPipe', () => {
  let pipe: ProcessBirthdayPipe;

  beforeEach(() => {
    pipe = new ProcessBirthdayPipe(new DatePipe('en-US'));
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return None if no dateValue is provided', () => {
    expect(pipe.transform('')).toBe('None');
  });

  it('should return None if dateValue is None', () => {
    expect(pipe.transform('None')).toBe('None');
  });

  it('should return formatted date if dateValue is provided', () => {
    const dateValue = '1989-05-23 13:25:14';
    expect(pipe.transform(dateValue)).toBe('23/05/1989');
  });

  it('should return None if dateValue is not a valid date', () => {
    const dateValue = 'invalid date';
    expect(pipe.transform(dateValue)).toBe('None');
  });
});
