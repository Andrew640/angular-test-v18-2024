import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientWithAccounts } from '@app/interfaces/client-with-accounts';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, FontAwesomeModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  @Input() client: ClientWithAccounts = {} as ClientWithAccounts;
  @Output() public closePopupClick: EventEmitter<void> = new EventEmitter();

  public faClose = faClose;

  public closePopup(): void {
    this.closePopupClick.emit();
  }
}
