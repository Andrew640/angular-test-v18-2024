import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set loading accounts', () => {
    service.setLoadingAccounts(true);
    expect(service['isAccountsDataLoading'].value).toBeTrue();
  });

  it('should set loading clients', () => {
    service.setLoadingClients(true);
    expect(service['isClientsDataLoading'].value).toBeTrue();
  });

  describe('isLoading', () => {
    it('should return loading observable false when nothing loading', () => {
      service.setLoadingAccounts(false);
      service.setLoadingClients(false);
      service.isLoading().subscribe((data) => {
        expect(data).toBeFalse();
      });
    });
    it('should return loading observable true when accounts are loading', () => {
      service.setLoadingAccounts(true);
      service.setLoadingClients(false);
      service.isLoading().subscribe((data) => {
        expect(data).toBeTrue();
      });
    });

    it('should return loading observable true when clients are loading', () => {
      service.setLoadingAccounts(false);
      service.setLoadingClients(true);
      service.isLoading().subscribe((data) => {
        expect(data).toBeTrue();
      });
    });

    it('should return loading observable true when accounts and clients are loading', () => {
      service.setLoadingAccounts(true);
      service.setLoadingClients(true);
      service.isLoading().subscribe((data) => {
        expect(data).toBeTrue();
      });
    });
  });
});
