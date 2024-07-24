import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Account } from '@app/interfaces/account';
import { SelectedPieAccounts } from '@app/interfaces/selected-pie-accounts';
import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';
import { Chart } from 'angular-highcharts';
import { ChartModule } from 'angular-highcharts';
import Highcharts from 'highcharts/highcharts';
import { AccountDisplay } from '@app/interfaces/account-display';
import { ACCOUNT_TYPE_ID } from '@app/interfaces/account-type-id';
import { ACCOUNT_TYPE_NAME } from '@app/interfaces/account-type-name';
import { ACCOUNT_TYPE_COLOR } from '@app/interfaces/account-type-color';

@Component({
  standalone: true,
  selector: 'app-pie-chart',
  imports: [ChartModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
  @Input() public client: ClientWithAccounts = {} as ClientWithAccounts;

  @Output() public selectedPieAccounts: EventEmitter<SelectedPieAccounts> =
    new EventEmitter();

  Highcharts: typeof Highcharts = Highcharts;

  public chart: Chart = new Chart();
  public chartId: string = '';
  public lastClick: string = '';

  constructor() {
    this.chartId = this.client.id;
  }

  public ngOnInit(): void {
    this.initializeChart();
  }

  public initializeChart(): void {
    const negativeAccounts: AccountDisplay[] = this.client.accounts.filter(
      (account) => account.balance < 0,
    );
    const zeroPlusAccounts: AccountDisplay[] = this.client.accounts.filter(
      (account) => account.balance >= 0,
    );

    const negativeAccountsPercentage: number = Math.floor(
      (negativeAccounts.length / this.client.accounts.length) * 100,
    );
    const zeroPlusAccountsPercentage: number = 100 - negativeAccountsPercentage;

    this.chart = new Chart({
      chart: {
        type: 'pie',
        width: 240,
        height: 240,
      },
      title: {
        text: '',
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          type: 'pie',
          animation: false,
          point: {
            events: {
              click: (event: Highcharts.PointClickEventObject) =>
                this.handlePieClick(event, negativeAccounts, zeroPlusAccounts),
            },
          },
          data: [
            {
              name: ACCOUNT_TYPE_NAME.NEGATIVE,
              y: negativeAccountsPercentage,
              id: ACCOUNT_TYPE_ID.NEGATIVE,
              color: ACCOUNT_TYPE_COLOR.NEGATIVE,
            },
            {
              name: ACCOUNT_TYPE_NAME.ZERO_PLUS,
              y: zeroPlusAccountsPercentage,
              id: ACCOUNT_TYPE_ID.ZERO_PLUS,
              color: ACCOUNT_TYPE_COLOR.ZERO_PLUS,
            },
          ],
          dataLabels: {
            enabled: false,
          },
        },
      ],
      tooltip: {
        pointFormat: '<b>{point.y}%</b>',
      },
    });
  }

  private handlePieClick(
    event: Highcharts.PointClickEventObject,
    negativeAccounts: AccountDisplay[],
    zeroPlusAccounts: AccountDisplay[],
  ): void {
    if (event?.point?.options?.id) {
      const id: string = event.point.options.id;
      const isSameClick: boolean = this.lastClick === id;

      if (isSameClick) {
        this.selectedPieAccounts.emit({
          clientId: this.client.id,
          type: '',
          accounts: [],
        });
        this.lastClick = '';
      } else {
        const accounts =
          id === ACCOUNT_TYPE_ID.NEGATIVE ? negativeAccounts : zeroPlusAccounts;
        this.selectedPieAccounts.emit({
          clientId: this.client.id,
          type: id,
          accounts: accounts,
        });
        this.lastClick = id;
      }
    }
  }
}
