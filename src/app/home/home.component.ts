import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ClientsService } from '@app/services/clients/clients.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { PopupComponent } from '@app/popup/popup.component';
import { PieChartComponent } from '@app/pie-chart/pie-chart.component';
import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';
import { BarChartComponent } from '@app/bar-chart/bar-chart.component';
import { UniqueAccountsPipe } from '@app/pipes/unique-accounts/unique-accounts.pipe';
import { LoadingService } from '@app/services/loading/loading.service';
import { ProcessBirthdayPipe } from '@app/pipes/process-birthday/process-birthday.pipe';
import { ClientComponent } from '@app/client/client.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    PopupComponent,
    PieChartComponent,
    BarChartComponent,
    UniqueAccountsPipe,
    ProcessBirthdayPipe,
    ClientComponent,
    PopupComponent,
  ],
  providers: [DatePipe],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    public clientsService: ClientsService,
    public loadingService: LoadingService,
  ) {
    this.clientsData = this.clientsService.getClientsWithAccountsData();

    this.clientsDataDisplay = this.clientsData.pipe(
      map((clients) => clients.filter((client) => client.display)),
    );

    this.isLoading = this.loadingService.isLoading();
    this.monitorEscClicks();
  }

  public clientsData: Observable<ClientWithAccounts[]>;
  public clientsDataDisplay: Observable<ClientWithAccounts[]>;
  public isLoading: Observable<boolean>;
  public activeClient: BehaviorSubject<ClientWithAccounts | null> =
    new BehaviorSubject<ClientWithAccounts | null>(null);

  public faSpinner = faSpinner;

  public isPopupOpen: boolean = false;

  private monitorEscClicks(): void {
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closePopup();
      }
    });
  }

  public openPopup(event: ClientWithAccounts): void {
    this.activeClient.next(event);
    this.isPopupOpen = true;
  }

  public closePopup(): void {
    this.isPopupOpen = false;
    this.activeClient.next(null);
  }

  public searchClients(event: any): void {
    this.clientsService.searchClients((event.target as HTMLInputElement).value);
  }
}

// TODO:
// - styling
// - cleanup
// - final check tests
