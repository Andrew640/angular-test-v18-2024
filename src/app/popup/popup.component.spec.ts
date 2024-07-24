import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupComponent } from './popup.component';

describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [PopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close popup', () => {
    spyOn(component.closePopupClick, 'emit');
    component.closePopup();
    expect(component.closePopupClick.emit).toHaveBeenCalled();
  });
});
