import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { provideHttpClient } from '@angular/common/http';
import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should monitor Esc clicks', () => {
    spyOn(window, 'addEventListener');
    component['monitorEscClicks']();
    expect(window.addEventListener).toHaveBeenCalled();
  });

  it('should open popup', () => {
    spyOn(component.activeClient, 'next');
    component.openPopup({} as ClientWithAccounts);
    expect(component.activeClient.next).toHaveBeenCalledWith(
      {} as ClientWithAccounts,
    );
    expect(component.isPopupOpen).toBeTrue();
  });

  it('should close popup', () => {
    spyOn(component.activeClient, 'next');
    component.closePopup();
    expect(component.activeClient.next).toHaveBeenCalledWith(null);
    expect(component.isPopupOpen).toBeFalsy();
  });

  it('should search clients', () => {
    spyOn(component.clientsService, 'searchClients');
    const event = {
      target: {
        value: 'searchTerm',
      },
    };
    component.searchClients(event);
    expect(component.clientsService.searchClients).toHaveBeenCalledWith(
      'searchTerm',
    );
  });
});
