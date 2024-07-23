import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartComponent } from './pie-chart.component';

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PieChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
    component.client = {
      id: 'client1',
      accounts: [
        {
          id: '6084118399e57e9b1e12ac45',
          card_type: 'VISA',
          number: 402400,
          balance: 100,
          created: '2021-04-24 12:39:31+00:00',
          display: true,
          name: 'Test Account',
        },
      ],
      name: 'Test Client',
      firstname: 'Test',
      address: '123 Test St',
      created: '2020-01-01',
      birthday: '1990-01-01',
      display: true,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
