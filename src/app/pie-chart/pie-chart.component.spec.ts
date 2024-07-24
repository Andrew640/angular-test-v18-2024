import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartComponent } from './pie-chart.component';
import { AccountDisplay } from '@app/interfaces/account-display';
import { clientsWithAccountsMock } from '@app/mocks/clients-with-accounts';
import { ACCOUNT_TYPE_COLOR } from '@app/interfaces/account-type-color';
import { ACCOUNT_TYPE_ID } from '@app/interfaces/account-type-id';

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PieChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
    component.client = clientsWithAccountsMock[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize chart', () => {
    component.initializeChart();
    expect(component.chart).toBeTruthy();
  });

  it('should initialize chart with correct data', () => {
    component.initializeChart();
    fixture.detectChanges();

    component.chart.ref$.subscribe((chart: Highcharts.Chart) => {
      const chartOptions = chart.options;

      expect(chartOptions.chart?.type).toEqual('pie');
      expect(chartOptions.chart?.width).toEqual(240);
      expect(chartOptions.chart?.height).toEqual(240);

      const series = chartOptions.series && chartOptions.series[0];
      if (series && series.type === 'pie' && series.data) {
        const dataMock = [
          {
            name: 'Negative balance accounts',
            y: 0,
            id: ACCOUNT_TYPE_ID.NEGATIVE,
            color: ACCOUNT_TYPE_COLOR.NEGATIVE,
          },
          {
            name: 'Zero+ balance accounts',
            y: 100,
            id: ACCOUNT_TYPE_ID.ZERO_PLUS,
            color: ACCOUNT_TYPE_COLOR.ZERO_PLUS,
          },
        ];
        expect(series.data.length).toBe(2);
        expect(series.data).toEqual(dataMock);
      } else {
        fail('Series data is not defined or chart not correct type');
      }
    });
  });

  describe('handlePieClick', () => {
    it('should emit selectedPieAccounts event with negative accounts', () => {
      const event = {
        point: {
          options: {
            id: ACCOUNT_TYPE_ID.NEGATIVE,
          },
        },
      } as Highcharts.PointClickEventObject;

      const negativeAccounts: AccountDisplay[] = component.client.accounts;
      const zeroPlusAccounts: AccountDisplay[] = [];

      spyOn(component.selectedPieAccounts, 'emit');

      component['handlePieClick'](event, negativeAccounts, zeroPlusAccounts);

      expect(component.selectedPieAccounts.emit).toHaveBeenCalledWith({
        clientId: component.client.id,
        type: ACCOUNT_TYPE_ID.NEGATIVE,
        accounts: negativeAccounts,
      });
    });

    it('should emit selectedPieAccounts event with zero+ accounts', () => {
      const event = {
        point: {
          options: {
            id: ACCOUNT_TYPE_ID.ZERO_PLUS,
          },
        },
      } as Highcharts.PointClickEventObject;

      const negativeAccounts: AccountDisplay[] = [];
      const zeroPlusAccounts: AccountDisplay[] = component.client.accounts;

      spyOn(component.selectedPieAccounts, 'emit');

      component['handlePieClick'](event, negativeAccounts, zeroPlusAccounts);

      expect(component.selectedPieAccounts.emit).toHaveBeenCalledWith({
        clientId: component.client.id,
        type: ACCOUNT_TYPE_ID.ZERO_PLUS,
        accounts: zeroPlusAccounts,
      });
    });

    it('should emit selectedPieAccounts event with empty accounts when lastClick equals current click', () => {
      const event = {
        point: {
          options: {
            id: ACCOUNT_TYPE_ID.NEGATIVE,
          },
        },
      } as Highcharts.PointClickEventObject;

      const negativeAccounts: AccountDisplay[] = [];
      const zeroPlusAccounts: AccountDisplay[] = [];

      component['lastClick'] = ACCOUNT_TYPE_ID.NEGATIVE;

      spyOn(component.selectedPieAccounts, 'emit');

      component['handlePieClick'](event, negativeAccounts, zeroPlusAccounts);

      expect(component.selectedPieAccounts.emit).toHaveBeenCalledWith({
        clientId: component.client.id,
        type: ACCOUNT_TYPE_ID.DEFAULT,
        accounts: [],
      });
    });
  });
});
