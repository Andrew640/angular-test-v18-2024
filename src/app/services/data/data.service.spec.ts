import { TestBed } from '@angular/core/testing';

import { DataService } from '../data/data.service';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have apiUrl defined', () => {
    expect(service['apiUrl']).toBeDefined();
  });

  describe('handleError', () => {
    it('should return an error message if error is an instance of ErrorEvent', () => {
      const error = {
        status: 404,
        message: 'Not Found',
        error: new ErrorEvent('Not Found', {
          message: 'Not Found',
        }),
      };
      const result = service['handleError'](error as HttpErrorResponse);
      expect(result).toBeDefined();
    });

    it('should return an error message if error is not an instance of ErrorEvent', () => {
      const error = {
        status: 404,
        message: 'Not Found',
        error: new Error('Not Found'),
      };
      const result = service['handleError'](error as HttpErrorResponse);
      expect(result).toBeDefined();
    });
  });
});
