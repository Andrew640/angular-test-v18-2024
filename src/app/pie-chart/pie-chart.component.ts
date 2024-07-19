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
  selector: 'app-pie-chart',
  imports: [ChartModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
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
    const negativeAccounts: number =
      (this.client.accounts.filter((account) => account.balance < 0).length /
        this.client.accounts.length) *
      100;

    this.chart = new Chart({
      chart: {
        type: 'pie',
        width: 300,
        height: 300,
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
          data: [
            {
              name: 'Negative balance accounts',
              y: negativeAccounts,
            },
            {
              name: 'Zero+ balance accounts',
              y: 100 - negativeAccounts,
            },
          ],
        },
      ],
    });
  }
}
