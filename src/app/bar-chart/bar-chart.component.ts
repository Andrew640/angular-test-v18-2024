import { Component, Input, OnInit } from '@angular/core';
import { Account } from '@app/interfaces/account';
import { SelectedPieAccounts } from '@app/interfaces/selected-pie-accounts';
import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';
import { Chart } from 'angular-highcharts';
import { ChartModule } from 'angular-highcharts';
import Highcharts from 'highcharts/highcharts';

@Component({
  standalone: true,
  selector: 'app-bar-chart',
  imports: [ChartModule],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent {
  @Input()
  set client(value: ClientWithAccounts) {
    this._client = value;
    this.initializeChart();
  }

  get client(): ClientWithAccounts {
    return this._client;
  }

  @Input()
  set highlightedAccounts(value: SelectedPieAccounts) {
    if (
      !this.client.id ||
      !value.clientId ||
      value.clientId !== this.client.id
    ) {
      return;
    }
    this._highlightedAccounts = value;
    this.initializeChart();
  }

  get highlightedAccounts(): SelectedPieAccounts {
    return this._highlightedAccounts;
  }

  private _client: ClientWithAccounts = {} as ClientWithAccounts;
  private _highlightedAccounts: SelectedPieAccounts = {} as SelectedPieAccounts;
  Highcharts: typeof Highcharts = Highcharts;

  public chart: Chart = new Chart();
  public chartId: string = '';

  constructor() {
    this.chartId = this.client.id;
  }

  public initializeChart(): void {
    const chartData = this.client.accounts
      .filter((account) => account.display)
      .map((account) => {
        const isHighlighted = this.highlightedAccounts.accounts
          ?.map((account) => account.id)
          .includes(account.id);

        const color = this.getColor(
          isHighlighted,
          this.highlightedAccounts.type,
        );

        return {
          name: account.name,
          y: account.balance,
          color: color,
          id: account.id,
        };
      });

    this.chart = new Chart({
      chart: {
        type: 'column',
        width: 240,
        height: 240,
      },
      title: {
        text: '',
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: chartData.map((account) => account.name),
      },
      yAxis: {
        title: {
          text: 'Balance',
        },
        labels: {
          format: '£{value}',
        },
      },
      series: [
        {
          type: 'column',
          name: 'Balance',
          data: chartData,
        },
      ],
      tooltip: {
        pointFormat: '{series.name}: <b>£{point.y}</b>',
      },
      legend: {
        enabled: false,
      },
    });
  }

  private getColor(isHighlighted: boolean, type: string): string {
    if (!isHighlighted) {
      return '#707384';
    } else if (type === '1') {
      return '#2caffe';
    } else {
      return '#544fc5';
    }
  }
}
