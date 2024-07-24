import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartComponent } from './bar-chart.component';
import { clientsWithAccountsMock } from '@app/mocks/clients-with-accounts';
import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';
import { ACCOUNT_TYPE_COLOR } from '@app/interfaces/account-type-color';
import { ACCOUNT_TYPE_ID } from '@app/interfaces/account-type-id';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    component.client = clientsWithAccountsMock[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initializeChart', () => {
    it('should initialize chart', () => {
      component.initializeChart();
      expect(component.chart).toBeTruthy();
    });

    it('should initialize chart with correct data', () => {
      component.initializeChart();
      fixture.detectChanges();

      component.chart.ref$.subscribe((chart: Highcharts.Chart) => {
        const chartOptions = chart.options;

        expect(chartOptions.chart?.type).toEqual('column');
        expect(chartOptions.chart?.width).toEqual(260);
        expect(chartOptions.chart?.height).toEqual(260);

        const series = chartOptions.series && chartOptions.series[0];
        if (series && series.type === 'column') {
          expect(series?.type).toEqual('column');
          expect(series?.name).toEqual('Balance');
          expect(series?.data?.length).toBeGreaterThan(0);
          expect(series?.data).toEqual([
            {
              name: 'Account 1',
              y: 100,
              color: ACCOUNT_TYPE_COLOR.DEFAULT,
              id: '6084118399e57e9b1e12ac45',
            },
            {
              name: 'Account 2',
              y: 200,
              color: ACCOUNT_TYPE_COLOR.DEFAULT,
              id: '6084122499e57e9b1e12ac47',
            },
          ]);
        } else {
          fail('Series data is not defined or chart not correct type');
        }
      });
    });

    it('should initialize chart with correct data when account is highlighted', () => {
      component.highlightedAccounts = {
        accounts: [component.client.accounts[0]],
        type: ACCOUNT_TYPE_ID.NEGATIVE,
        clientId: component.client.id,
      };
      component.initializeChart();
      fixture.detectChanges();

      component.chart.ref$.subscribe((chart: Highcharts.Chart) => {
        const chartOptions = chart.options;
        const series = chartOptions.series && chartOptions.series[0];
        if (series && series.type === 'column') {
          expect(series?.data).toEqual([
            {
              name: 'Account 1',
              y: 100,
              color: ACCOUNT_TYPE_COLOR.NEGATIVE,
              id: '6084118399e57e9b1e12ac45',
            },
            {
              name: 'Account 2',
              y: 200,
              color: ACCOUNT_TYPE_COLOR.DEFAULT,
              id: '6084122499e57e9b1e12ac47',
            },
          ]);
        } else {
          fail('Series data is not defined or chart not correct type');
        }
      });
    });

    it('should initialize chart with correct data when account is highlighted and type is 1', () => {
      component.highlightedAccounts = {
        accounts: [component.client.accounts[0]],
        type: ACCOUNT_TYPE_ID.ZERO_PLUS,
        clientId: component.client.id,
      };
      component.initializeChart();
      fixture.detectChanges();

      component.chart.ref$.subscribe((chart: Highcharts.Chart) => {
        const chartOptions = chart.options;
        const series = chartOptions.series && chartOptions.series[0];
        if (series && series.type === 'column') {
          expect(series?.data).toEqual([
            {
              name: 'Account 1',
              y: 100,
              color: ACCOUNT_TYPE_COLOR.ZERO_PLUS,
              id: '6084118399e57e9b1e12ac45',
            },
            {
              name: 'Account 2',
              y: 200,
              color: ACCOUNT_TYPE_COLOR.DEFAULT,
              id: '6084122499e57e9b1e12ac47',
            },
          ]);
        } else {
          fail('Series data is not defined or chart not correct type');
        }
      });
    });
  });

  describe('getColor', () => {
    it('should return #707384 if isHighlighted is false', () => {
      expect(component['getColor'](false, ACCOUNT_TYPE_ID.DEFAULT)).toBe(
        ACCOUNT_TYPE_COLOR.DEFAULT,
      );
    });

    it('should return #2caffe if isHighlighted is true and type is 1', () => {
      expect(component['getColor'](true, ACCOUNT_TYPE_ID.NEGATIVE)).toBe(
        ACCOUNT_TYPE_COLOR.NEGATIVE,
      );
    });

    it('should return #544fc5 if isHighlighted is true and type is not 1', () => {
      expect(component['getColor'](true, ACCOUNT_TYPE_ID.ZERO_PLUS)).toBe(
        ACCOUNT_TYPE_COLOR.ZERO_PLUS,
      );
    });
  });
});
