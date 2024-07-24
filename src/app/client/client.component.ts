import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientsService } from '@app/services/clients/clients.service';
import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';
import { SelectedPieAccounts } from '@app/interfaces/selected-pie-accounts';
import { BarChartComponent } from '@app/bar-chart/bar-chart.component';
import { UniqueAccountsPipe } from '@app/pipes/unique-accounts/unique-accounts.pipe';
import { PieChartComponent } from '@app/pie-chart/pie-chart.component';
import { ProcessBirthdayPipe } from '@app/pipes/process-birthday/process-birthday.pipe';

@Component({
  standalone: true,
  imports: [
    BarChartComponent,
    PieChartComponent,
    UniqueAccountsPipe,
    ProcessBirthdayPipe,
  ],
  providers: [],
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent {
  @Input() public client: ClientWithAccounts = {} as ClientWithAccounts;

  @Output() public openPopupClick: EventEmitter<ClientWithAccounts> =
    new EventEmitter();

  public highlightedAccounts: SelectedPieAccounts = {} as SelectedPieAccounts;

  constructor(public clientsService: ClientsService) {}

  public openPopup(client: ClientWithAccounts): void {
    this.openPopupClick.emit(client);
  }

  public toggleClientAccountsDisplay(clientId: string, cardType: string): void {
    this.clientsService.toggleClientAccountsDisplay(clientId, cardType);
  }

  public selectedPieAccounts(selectedPieAccounts: SelectedPieAccounts): void {
    this.highlightedAccounts = selectedPieAccounts;
  }
}
