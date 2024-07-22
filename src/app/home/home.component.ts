import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  input,
} from '@angular/core';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { ClientsService } from '@app/services/clients/clients.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner, faClose } from '@fortawesome/free-solid-svg-icons';
import { PopupComponent } from '@app/popup/popup.component';
import { PieChartComponent } from '@app/pie-chart/pie-chart.component';
import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';
import { BarChartComponent } from '@app/bar-chart/bar-chart.component';
import { UniqueAccountsPipe } from '@app/pipes/unique-accounts.pipe';
import { Event } from '@angular/router';
import { Account } from '@app/interfaces/account';
import { SelectedPieAccounts } from '@app/interfaces/selected-pie-accounts';
import { LoadingService } from '@app/services/loading/loading.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    PopupComponent,
    PieChartComponent,
    BarChartComponent,
    UniqueAccountsPipe,
  ],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    public clientsService: ClientsService,
    public loadingService: LoadingService,
  ) {
    this.clientsData = this.clientsService
      .getClientsWithAccountsData()
      .pipe(map((clients) => clients.filter((client) => client.display)));

    this.isLoading = this.loadingService.isLoading();

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closePopup();
      }
    });
  }

  public clientsData: Observable<ClientWithAccounts[]>;
  public isLoading: Observable<boolean>;
  public activeClient: BehaviorSubject<ClientWithAccounts | null> =
    new BehaviorSubject<ClientWithAccounts | null>(null);

  public faSpinner = faSpinner;
  public faClose = faClose;

  public isPopupOpen: boolean = false;

  public highlightedAccounts: SelectedPieAccounts = {} as SelectedPieAccounts;

  public openPopup(client: ClientWithAccounts): void {
    this.activeClient.next(client);
    this.isPopupOpen = true;
  }

  public closePopup(): void {
    this.isPopupOpen = false;
    this.activeClient.next(null);
  }

  public filterClientAccounts(clientId: string, accountId: string): void {
    this.clientsService.filterClientAccounts(clientId, accountId);
  }

  public searchClients(event: any): void {
    this.clientsService.searchClients((event.target as HTMLInputElement).value);
  }

  public selectedPieAccounts(selectedPieAccounts: SelectedPieAccounts): void {
    this.highlightedAccounts = selectedPieAccounts;
  }
}

// TODO:
// - styling
// - split into components
// - tests
