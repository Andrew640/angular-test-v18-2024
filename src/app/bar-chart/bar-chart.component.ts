import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  AfterViewInit,
  ElementRef,
  ViewChild,
  AfterContentInit,
} from '@angular/core';
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
  @Input() public client: ClientWithAccounts = {} as ClientWithAccounts;
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
    this.chart = new Chart({
      chart: {
        type: 'column',
        width: 300,
        height: 300,
      },
      title: {
        text: '',
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: [],
        title: {
          text: 'Accounts',
        },
      },
      yAxis: {
        title: {
          text: 'Balance',
        },
        labels: {
          format: '{value}',
        },
      },
      series: [
        {
          type: 'column',
          data: this.client.accounts.map((account, i) => {
            return {
              name: 'Account ' + (i + 1),
              y: account.balance,
            };
          }),
        },
      ],
      legend: {
        enabled: false,
      },
    });
  }
}
