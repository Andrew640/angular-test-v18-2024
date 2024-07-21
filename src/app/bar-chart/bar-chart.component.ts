import { Component, Input, OnInit } from '@angular/core';
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
export class BarChartComponent implements OnInit {
  @Input()
  set client(value: ClientWithAccounts) {
    this._client = value;
    this.initializeChart();
  }

  get client(): ClientWithAccounts {
    return this._client;
  }

  private _client: ClientWithAccounts = {} as ClientWithAccounts;
  Highcharts: typeof Highcharts = Highcharts;

  public chart: Chart = new Chart();
  public chartId: string = '';

  constructor() {
    this.chartId = this.client.id;
  }

  public ngOnInit(): void {
    this.initializeChart();
  }

  public initializeChart(): void {
    const seriesData = this.client.accounts
      .filter((account) => account.display)
      .map((account, i) => {
        return {
          name: account.name,
          y: account.balance,
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
        categories: seriesData.map((account) => account.name),
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
          data: seriesData,
        },
      ],
      legend: {
        enabled: false,
      },
    });
  }
}
