import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'processBirthday',
  standalone: true,
})
export class ProcessBirthdayPipe implements PipeTransform {
  public constructor(private datePipe: DatePipe) {}

  transform(dateValue: string): string {
    if (!dateValue || isNaN(Date.parse(dateValue)) || dateValue === 'None') {
      return 'None';
    }
    return this.datePipe.transform(dateValue, 'dd/MM/yyyy') ?? 'None';
  }
}
