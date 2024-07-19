import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  @Input() account: any;

  public open: boolean = false;

  constructor() {}

  public togglePopup(): void {
    this.open = !this.open;
  }
}
