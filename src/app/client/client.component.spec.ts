import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientComponent } from './client.component';
import { provideHttpClient } from '@angular/common/http';
import { SelectedPieAccounts } from '@app/interfaces/selected-pie-accounts';
import { DatePipe } from '@angular/common';

describe('ClientComponent', () => {
  let component: ClientComponent;
  let fixture: ComponentFixture<ClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClientComponent],
      providers: [provideHttpClient(), DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open popup', () => {
    spyOn(component.openPopupClick, 'emit');
    component.openPopup({} as any);
    expect(component.openPopupClick.emit).toHaveBeenCalled;
  });

  it('should toggle client accounts display', () => {
    spyOn(component.clientsService, 'toggleClientAccountsDisplay');
    component.toggleClientAccountsDisplay('clientId', 'cardType');
    expect(
      component.clientsService.toggleClientAccountsDisplay,
    ).toHaveBeenCalledWith('clientId', 'cardType');
  });

  it('should set selected pie accounts', () => {
    const selectedPieAccounts = {} as SelectedPieAccounts;
    component.selectedPieAccounts(selectedPieAccounts);
    expect(component.highlightedAccounts).toBe(selectedPieAccounts);
  });
});
