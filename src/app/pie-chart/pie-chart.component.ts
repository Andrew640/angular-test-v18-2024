import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Account } from '@app/interfaces/account';
import { SelectedPieAccounts } from '@app/interfaces/selected-pie-accounts';
import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';
import { Chart } from 'angular-highcharts';
import { ChartModule } from 'angular-highcharts';
import Highcharts from 'highcharts/highcharts';

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
    const negativeAccounts: Account[] = this.client.accounts.filter(
      (account) => account.balance < 0,
    );
    const zeroPlusAccounts: Account[] = this.client.accounts.filter(
      (account) => account.balance >= 0,
    );

    const negativeAccountsPercentage: number =
      (negativeAccounts.length / this.client.accounts.length) * 100;
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
              name: 'Negative balance accounts',
              y: negativeAccountsPercentage,
              id: '1',
              color: '#2caffe',
            },
            {
              name: 'Zero+ balance accounts',
              y: zeroPlusAccountsPercentage,
              id: '2',
              color: '#544fc5',
            },
          ],
          dataLabels: {
            enabled: false,
          },
        },
      ],
    });
  }

  private handlePieClick(
    event: Highcharts.PointClickEventObject,
    negativeAccounts: Account[],
    zeroPlusAccounts: Account[],
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
        const accounts = id === '1' ? negativeAccounts : zeroPlusAccounts;
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
